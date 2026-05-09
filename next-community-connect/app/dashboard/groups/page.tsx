'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Plus, Mail, Trash2, Crown, Users, X, ChevronDown, Send } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useAchievements } from '@/context/AchievementsContext'
import { supabase } from '@/lib/supabaseClient'

type Group = {
  id: string
  creator_id: string
  name: string
  description: string
  created_at: string
  members?: Member[]
}

type Member = {
  id: string
  email: string
  role: string
}

export default function GroupsPage() {
  const { user, isSignedIn } = useAuth()
  const { markPageVisited } = useAchievements()

  const [groups, setGroups]       = useState<Group[]>([])
  const [loading, setLoading]     = useState(true)
  const [creating, setCreating]   = useState(false)
  const [expanded, setExpanded]   = useState<string | null>(null)
  const [form, setForm]           = useState({ name: '', description: '', emails: '' })
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => { markPageVisited('groups') }, [markPageVisited])

  const fetchGroups = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data: myGroups } = await supabase
        .from('community_groups')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

      const { data: memberGroups } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)

      const memberGroupIds = (memberGroups || []).map((m: { group_id: string }) => m.group_id)

      let allGroups: Group[] = [...(myGroups || [])]

      if (memberGroupIds.length) {
        const { data: extra } = await supabase
          .from('community_groups')
          .select('*')
          .in('id', memberGroupIds)
        allGroups = [...allGroups, ...(extra || [])].filter(
          (g, i, arr) => arr.findIndex(x => x.id === g.id) === i
        )
      }

      // Fetch members for each group
      const withMembers = await Promise.all(allGroups.map(async g => {
        const { data: mems } = await supabase
          .from('group_members')
          .select('id, email, role')
          .eq('group_id', g.id)
        return { ...g, members: (mems || []) as Member[] }
      }))

      setGroups(withMembers)
    } catch { /* table may not exist yet */ } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchGroups() }, [fetchGroups])

  const createGroup = async () => {
    if (!user || !form.name.trim()) { setError('Group name is required.'); return }
    setSaving(true)
    setError('')

    const { data: newGroup, error: groupErr } = await supabase
      .from('community_groups')
      .insert({ creator_id: user.id, name: form.name.trim(), description: form.description.trim() })
      .select()
      .single()

    if (groupErr || !newGroup) {
      setError('Failed to create group. Make sure the community_groups table exists (see supabase/community_features.sql).')
      setSaving(false)
      return
    }

    const emails = form.emails.split(/[,\n]+/).map(e => e.trim()).filter(Boolean)
    if (emails.length) {
      await supabase.from('group_members').insert(
        emails.map(email => ({ group_id: newGroup.id, user_id: user.id, email, role: 'member' }))
      )
    }

    setSaving(false)
    setCreating(false)
    setForm({ name: '', description: '', emails: '' })
    fetchGroups()
  }

  const deleteGroup = async (groupId: string) => {
    if (!confirm('Delete this group? This cannot be undone.')) return
    await supabase.from('community_groups').delete().eq('id', groupId)
    setGroups(prev => prev.filter(g => g.id !== groupId))
  }

  const addMember = async (groupId: string, email: string) => {
    if (!email.trim()) return
    await supabase.from('group_members').insert({ group_id: groupId, user_id: user!.id, email: email.trim(), role: 'member' })
    fetchGroups()
  }

  const removeMember = async (memberId: string, groupId: string) => {
    await supabase.from('group_members').delete().eq('id', memberId)
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, members: g.members?.filter(m => m.id !== memberId) } : g))
  }

  const emailAll = (group: Group) => {
    const emails = (group.members || []).map(m => m.email).filter(Boolean)
    if (!emails.length) { alert('No members to email.'); return }
    const subject = encodeURIComponent(`[${group.name}] Group message`)
    window.open(`mailto:${emails.join(',')}?subject=${subject}`)
  }

  if (!isSignedIn) return (
    <div className="flex items-center justify-center h-full min-h-[400px]" style={{ background: 'linear-gradient(150deg,#011629,#022747)' }}>
      <p className="font-outfit text-white">Sign in to manage groups.</p>
    </div>
  )

  return (
    <div className="min-h-full px-4 sm:px-6 lg:px-8 py-8" style={{ background: 'linear-gradient(150deg,#011629 0%,#022747 60%,#011629 100%)' }}>
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <Layers size={18} style={{ color: '#818CF8' }} />
            </div>
            <div>
              <h1 className="font-syne text-2xl font-black text-white">Groups</h1>
              <p className="font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.45)' }}>Create groups, manage members, send bulk emails</p>
            </div>
          </div>
          <button onClick={() => setCreating(c => !c)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-outfit text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#4F46E5,#818CF8)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
            <Plus size={15} /> New Group
          </button>
        </motion.div>

        {/* Create form */}
        <AnimatePresence>
          {creating && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)' }}>
                <div className="flex justify-between items-center">
                  <p className="font-syne text-sm font-bold text-white">New Group</p>
                  <button onClick={() => { setCreating(false); setError('') }}><X size={15} style={{ color: 'rgba(198,235,255,0.4)' }} /></button>
                </div>

                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Group name *" className="w-full px-4 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-indigo-400/40"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(99,102,241,0.25)' }} />

                <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Description (optional)" className="w-full px-4 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-indigo-400/40 resize-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(99,102,241,0.25)' }} />

                <div>
                  <label className="block font-outfit text-[10px] uppercase tracking-wider mb-1.5" style={{ color: 'rgba(198,235,255,0.45)' }}>
                    Member Emails (comma or line separated)
                  </label>
                  <textarea rows={3} value={form.emails} onChange={e => setForm(p => ({ ...p, emails: e.target.value }))}
                    placeholder={"friend@email.com,\nanother@email.com"} className="w-full px-4 py-2.5 rounded-xl font-outfit text-sm text-white outline-none focus:ring-1 focus:ring-indigo-400/40 resize-none"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(99,102,241,0.25)' }} />
                </div>

                {error && <p className="font-outfit text-xs text-red-400">{error}</p>}

                <button onClick={createGroup} disabled={saving || !form.name.trim()}
                  className="w-full py-2.5 rounded-xl font-outfit text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#4F46E5,#818CF8)' }}>
                  {saving ? 'Creating…' : 'Create Group'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Groups list */}
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-5 h-5 rounded-full border-2 border-indigo-400/30 border-t-indigo-400 animate-spin" /></div>
        ) : groups.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'rgba(198,235,255,0.4)' }}>
            <Layers size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-syne text-base font-bold text-white mb-1">No groups yet</p>
            <p className="font-outfit text-sm">Create a group to organize community members.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                isCreator={group.creator_id === user?.id}
                expanded={expanded === group.id}
                onToggle={() => setExpanded(expanded === group.id ? null : group.id)}
                onDelete={() => deleteGroup(group.id)}
                onEmailAll={() => emailAll(group)}
                onAddMember={(email) => addMember(group.id, email)}
                onRemoveMember={(memberId) => removeMember(memberId, group.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function GroupCard({ group, isCreator, expanded, onToggle, onDelete, onEmailAll, onAddMember, onRemoveMember }: {
  group: Group; isCreator: boolean; expanded: boolean
  onToggle: () => void; onDelete: () => void; onEmailAll: () => void
  onAddMember: (email: string) => void; onRemoveMember: (id: string) => void
}) {
  const [newEmail, setNewEmail] = useState('')

  return (
    <motion.div layout className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.15)' }}>
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/2 transition-colors">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-syne font-black text-sm text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.4),rgba(99,102,241,0.15))', border: '1px solid rgba(99,102,241,0.3)' }}>
          {group.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-syne text-sm font-bold text-white truncate">{group.name}</p>
            {isCreator && <Crown size={12} style={{ color: '#FCD34D' }} />}
          </div>
          <p className="font-outfit text-[11px]" style={{ color: 'rgba(198,235,255,0.4)' }}>
            {group.members?.length || 0} member{(group.members?.length || 0) !== 1 ? 's' : ''}
            {group.description ? ` · ${group.description}` : ''}
          </p>
        </div>
        <ChevronDown size={15} className="flex-shrink-0 transition-transform" style={{ color: 'rgba(198,235,255,0.35)', transform: expanded ? 'rotate(180deg)' : 'none' }} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-5 pb-4 space-y-3 border-t" style={{ borderColor: 'rgba(99,102,241,0.12)' }}>

              {/* Actions */}
              <div className="flex gap-2 pt-3">
                <button onClick={onEmailAll}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-outfit text-xs font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg,#0857A0,#2499D6)' }}>
                  <Send size={12} /> Email All Members
                </button>
                {isCreator && (
                  <button onClick={onDelete} className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-outfit text-xs text-red-400 hover:bg-red-400/10 transition-colors">
                    <Trash2 size={12} /> Delete Group
                  </button>
                )}
              </div>

              {/* Members */}
              <div>
                <p className="font-outfit text-[10px] uppercase tracking-wider mb-2" style={{ color: 'rgba(198,235,255,0.4)' }}>Members</p>
                {!group.members?.length ? (
                  <p className="font-outfit text-xs" style={{ color: 'rgba(198,235,255,0.35)' }}>No members yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {group.members.map(m => (
                      <div key={m.id} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center font-syne text-xs font-bold text-white" style={{ background: 'rgba(99,102,241,0.25)' }}>
                          {m.email.slice(0, 2).toUpperCase()}
                        </div>
                        <p className="flex-1 font-outfit text-xs text-white truncate">{m.email}</p>
                        {m.role === 'admin' && <Crown size={11} style={{ color: '#FCD34D' }} />}
                        <a href={`mailto:${m.email}`} className="p-1 rounded-lg hover:bg-sky-400/10 transition-colors" style={{ color: 'rgba(198,235,255,0.4)' }}>
                          <Mail size={12} />
                        </a>
                        {isCreator && (
                          <button onClick={() => onRemoveMember(m.id)} className="p-1 rounded-lg hover:bg-red-400/10 transition-colors" style={{ color: 'rgba(198,235,255,0.3)' }}>
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add member */}
              {isCreator && (
                <div className="flex gap-2">
                  <input value={newEmail} onChange={e => setNewEmail(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { onAddMember(newEmail); setNewEmail('') } }}
                    placeholder="Add member email…" className="flex-1 px-3 py-2 rounded-xl font-outfit text-xs text-white outline-none focus:ring-1 focus:ring-indigo-400/35"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(99,102,241,0.2)' }} />
                  <button onClick={() => { onAddMember(newEmail); setNewEmail('') }}
                    className="px-3 py-2 rounded-xl font-outfit text-xs font-semibold text-white transition-colors"
                    style={{ background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.35)' }}>
                    <Plus size={13} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
