export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      wishlist_causes: {
        Row: {
          id: string
          cause_name: string
          goal_amount: number
          current_amount: number | null
          supporter_count: number | null
          category_icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          cause_name: string
          goal_amount: number
          current_amount?: number | null
          supporter_count?: number | null
          category_icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          cause_name?: string
          goal_amount?: number
          current_amount?: number | null
          supporter_count?: number | null
          category_icon?: string | null
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          status: string
          resource_name: string
          category: string
          description: string
          contact_email: string
          phone: string | null
          address: string | null
          hours: string | null
          website: string | null
          created_at: string
        }
        Insert: {
          id?: string
          status?: string
          resource_name: string
          category: string
          description: string
          contact_email: string
          phone?: string | null
          address?: string | null
          hours?: string | null
          website?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          status?: string | null
          resource_name?: string | null
          category?: string | null
          description?: string | null
          contact_email?: string | null
          phone?: string | null
          address?: string | null
          hours?: string | null
          website?: string | null
          created_at?: string | null
        }
      }
    }
  }
}

