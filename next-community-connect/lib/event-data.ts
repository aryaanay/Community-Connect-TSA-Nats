export type StaticEvent = {
  id: string
  title: string
  date: string
  time: string
  location: string
  emoji: string
}

export const staticEvents: StaticEvent[] = [
  {
    id: 'cleanup',
    title: 'Community Cleanup Drive',
    date: 'May 25, 2026',
    time: '10:00 AM - 1:00 PM',
    location: 'Bothell Landing Park, 9919 NE 180th St, Bothell WA',
    emoji: '🌿',
  },
  {
    id: 'stem',
    title: 'STEM Mentorship Workshop',
    date: 'June 2, 2026',
    time: '4:00 PM - 6:30 PM',
    location: 'Bothell Regional Library, 18215 98th Ave NE, Bothell WA',
    emoji: '💻',
  },
  {
    id: 'food',
    title: 'Northshore Food Drive',
    date: 'May 16, 2026',
    time: '9:00 AM - 4:00 PM',
    location: 'Hopelink Bothell, 23640 Bothell Everett Hwy, Bothell WA',
    emoji: '🥫',
  },
  {
    id: 'clothing',
    title: 'Clothing & Essentials Drive',
    date: 'May 30, 2026',
    time: '10:00 AM - 3:00 PM',
    location: 'Bothell City Hall, 18415 101st Ave NE, Bothell WA',
    emoji: '🧥',
  },
  {
    id: 'garden',
    title: 'Community Garden Workshop',
    date: 'June 6, 2026',
    time: '9:00 AM - 12:00 PM',
    location: 'Bothell Community Garden, 5th & Maple, Bothell WA',
    emoji: '🌱',
  },
  {
    id: 'health',
    title: 'Senior Health & Wellness Fair',
    date: 'June 20, 2026',
    time: '10:00 AM - 2:00 PM',
    location: 'Northshore Senior Center, 10201 E Riverside Dr, Bothell WA',
    emoji: '💙',
  },
  {
    id: 'block',
    title: 'Bothell Independence Day Celebration',
    date: 'July 4, 2026',
    time: '12:00 PM - 9:00 PM',
    location: 'Bothell Landing Park, 9919 NE 180th St, Bothell WA',
    emoji: '🎆',
  },
  {
    id: 'school',
    title: 'Back-to-School Supply Drive',
    date: 'August 8, 2026',
    time: '10:00 AM - 3:00 PM',
    location: 'Northshore Volunteer Services, 6809 228th St SW, Mountlake Terrace WA',
    emoji: '🎒',
  },
]
