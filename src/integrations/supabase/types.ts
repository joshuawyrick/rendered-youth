export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      design_mockups: {
        Row: {
          created_at: string
          design_id: string
          id: string
          mockup_order: number
          mockup_url: string
        }
        Insert: {
          created_at?: string
          design_id: string
          id?: string
          mockup_order?: number
          mockup_url: string
        }
        Update: {
          created_at?: string
          design_id?: string
          id?: string
          mockup_order?: number
          mockup_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_mockups_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
        ]
      }
      design_selections: {
        Row: {
          design_id: string
          id: string
          selected_at: string
          selected_mockup_id: string
        }
        Insert: {
          design_id: string
          id?: string
          selected_at?: string
          selected_mockup_id: string
        }
        Update: {
          design_id?: string
          id?: string
          selected_at?: string
          selected_mockup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_selections_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "design_selections_selected_mockup_id_fkey"
            columns: ["selected_mockup_id"]
            isOneToOne: false
            referencedRelation: "design_mockups"
            referencedColumns: ["id"]
          },
        ]
      }
      designs: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_url: string
          id: string
          inspiration: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size: number
          file_url: string
          id?: string
          inspiration?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          inspiration?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string
          email_on_review_ready: boolean | null
          email_on_selection_complete: boolean | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_on_review_ready?: boolean | null
          email_on_selection_complete?: boolean | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_on_review_ready?: boolean | null
          email_on_selection_complete?: boolean | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          creator_commission_rate: number
          design_id: string
          id: string
          price: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_commission_rate?: number
          design_id: string
          id?: string
          price?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_commission_rate?: number
          design_id?: string
          id?: string
          price?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_distributions: {
        Row: {
          commission_amount: number
          created_at: string
          creator_user_id: string
          id: string
          payout_date: string | null
          payout_status: string
          period_end: string
          period_start: string
          total_sales_amount: number
        }
        Insert: {
          commission_amount: number
          created_at?: string
          creator_user_id: string
          id?: string
          payout_date?: string | null
          payout_status?: string
          period_end: string
          period_start: string
          total_sales_amount: number
        }
        Update: {
          commission_amount?: number
          created_at?: string
          creator_user_id?: string
          id?: string
          payout_date?: string | null
          payout_status?: string
          period_end?: string
          period_start?: string
          total_sales_amount?: number
        }
        Relationships: []
      }
      sales: {
        Row: {
          admin_revenue: number
          creator_commission: number
          customer_email: string | null
          customer_name: string | null
          id: string
          order_status: string
          product_id: string
          quantity: number
          sale_date: string
          total_amount: number
          unit_price: number
        }
        Insert: {
          admin_revenue: number
          creator_commission: number
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          order_status?: string
          product_id: string
          quantity?: number
          sale_date?: string
          total_amount: number
          unit_price: number
        }
        Update: {
          admin_revenue?: number
          creator_commission?: number
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          order_status?: string
          product_id?: string
          quantity?: number
          sale_date?: string
          total_amount?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_dashboard_stats: {
        Row: {
          active_products_count: number | null
          admin_revenue_last_30_days: number | null
          creator_commissions_last_30_days: number | null
          mockups_ready_count: number | null
          pending_review_count: number | null
          published_count: number | null
          revenue_last_30_days: number | null
          selected_count: number | null
          units_sold_last_30_days: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
