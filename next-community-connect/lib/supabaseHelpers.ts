import { supabase } from './supabaseClient'
import type { Database } from '../types/supabase'

// Update cause donation - optimistic then sync
export async function updateCauseDonation(causeId: string, amount: number) {
  try {
    // Optimistic: Get current
    const { data: cause } = await supabase
      .from('wishlist_causes')
      .select('current_amount, supporter_count, goal_amount')
      .eq('id', causeId)
      .single()

    if (!cause) throw new Error('Cause not found')

    const newAmount = (cause.current_amount || 0) + amount
    const newSupporters = (cause.supporter_count || 0) + 1

    // Update DB
    const { error } = await supabase
      .from('wishlist_causes')
      .update({ 
        current_amount: newAmount,
        supporter_count: newSupporters 
      })
      .eq('id', causeId)

    if (error) throw error

    return { success: true, newAmount, newSupporters, goal: cause.goal_amount }
  } catch (error) {
    console.error('Donation update failed:', error)
    throw error
  }
}

// Submit resource
export async function submitResource(formData: any) {
  try {
    const { error } = await supabase.from('submissions').insert([{
      resource_name: formData.name,
      category: formData.category,
      description: formData.description,
      contact_email: formData.email,
      phone: formData.phone || null,
      address: formData.address || null,
      hours: formData.hours || null,
      website: formData.website || null,
    }])

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Submission failed:', error)
    throw error
  }
}

