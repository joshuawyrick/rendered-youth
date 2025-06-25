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
      age_verification: {
        Row: {
          created_at: string
          date_of_birth: string
          id: string
          is_minor: boolean
          parent_email: string | null
          requires_parent_consent: boolean
          session_token: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          date_of_birth: string
          id?: string
          is_minor: boolean
          parent_email?: string | null
          requires_parent_consent: boolean
          session_token?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string
          id?: string
          is_minor?: boolean
          parent_email?: string | null
          requires_parent_consent?: boolean
          session_token?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
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
          collection_id: string | null
          created_at: string
          file_name: string
          file_size: number
          file_url: string
          id: string
          inspiration: string | null
          status: string | null
          subcollection_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          collection_id?: string | null
          created_at?: string
          file_name: string
          file_size: number
          file_url: string
          id?: string
          inspiration?: string | null
          status?: string | null
          subcollection_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          collection_id?: string | null
          created_at?: string
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          inspiration?: string | null
          status?: string | null
          subcollection_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "designs_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designs_subcollection_id_fkey"
            columns: ["subcollection_id"]
            isOneToOne: false
            referencedRelation: "subcollections"
            referencedColumns: ["id"]
          },
        ]
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
      parent_verification_tokens: {
        Row: {
          age_verification_id: string
          created_at: string
          expires_at: string
          id: string
          parent_email: string
          token_hash: string
          verification_ip_address: unknown | null
          verified_at: string | null
        }
        Insert: {
          age_verification_id: string
          created_at?: string
          expires_at: string
          id?: string
          parent_email: string
          token_hash: string
          verification_ip_address?: unknown | null
          verified_at?: string | null
        }
        Update: {
          age_verification_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          parent_email?: string
          token_hash?: string
          verification_ip_address?: unknown | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_verification_tokens_age_verification_id_fkey"
            columns: ["age_verification_id"]
            isOneToOne: false
            referencedRelation: "age_verification"
            referencedColumns: ["id"]
          },
        ]
      }
      printful_products: {
        Row: {
          created_at: string
          id: string
          last_sync_at: string | null
          printful_product_id: string
          product_id: string
          sync_error_message: string | null
          sync_status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_sync_at?: string | null
          printful_product_id: string
          product_id: string
          sync_error_message?: string | null
          sync_status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_sync_at?: string | null
          printful_product_id?: string
          product_id?: string
          sync_error_message?: string | null
          sync_status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "printful_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          color: string
          created_at: string
          id: string
          is_available: boolean
          price_adjustment: number | null
          printful_variant_id: string | null
          product_id: string
          size: string
          variant_type: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          is_available?: boolean
          price_adjustment?: number | null
          printful_variant_id?: string | null
          product_id: string
          size: string
          variant_type: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          is_available?: boolean
          price_adjustment?: number | null
          printful_variant_id?: string | null
          product_id?: string
          size?: string
          variant_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          additional_images: Json | null
          assigned_user_id: string | null
          base_price: number | null
          collection_id: string | null
          created_at: string
          creator_commission_rate: number
          description: string | null
          design_id: string
          id: string
          price: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          additional_images?: Json | null
          assigned_user_id?: string | null
          base_price?: number | null
          collection_id?: string | null
          created_at?: string
          creator_commission_rate?: number
          description?: string | null
          design_id: string
          id?: string
          price?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          additional_images?: Json | null
          assigned_user_id?: string | null
          base_price?: number | null
          collection_id?: string | null
          created_at?: string
          creator_commission_rate?: number
          description?: string | null
          design_id?: string
          id?: string
          price?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string
          age_bracket: string | null
          bio: string | null
          created_at: string
          facebook_handle: string | null
          first_name: string | null
          id: string
          instagram_handle: string | null
          is_minor: boolean | null
          last_name: string | null
          parent_email: string | null
          profile_image_url: string | null
          requires_parent_consent: boolean | null
          state: string | null
          tiktok_handle: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          account_type?: string
          age_bracket?: string | null
          bio?: string | null
          created_at?: string
          facebook_handle?: string | null
          first_name?: string | null
          id: string
          instagram_handle?: string | null
          is_minor?: boolean | null
          last_name?: string | null
          parent_email?: string | null
          profile_image_url?: string | null
          requires_parent_consent?: boolean | null
          state?: string | null
          tiktok_handle?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          account_type?: string
          age_bracket?: string | null
          bio?: string | null
          created_at?: string
          facebook_handle?: string | null
          first_name?: string | null
          id?: string
          instagram_handle?: string | null
          is_minor?: boolean | null
          last_name?: string | null
          parent_email?: string | null
          profile_image_url?: string | null
          requires_parent_consent?: boolean | null
          state?: string | null
          tiktok_handle?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
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
      security_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subcollections: {
        Row: {
          collection_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcollections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consents: {
        Row: {
          child_user_id: string | null
          consent_given_at: string
          consent_ip_address: unknown | null
          consent_method: string
          created_at: string
          id: string
          is_active: boolean
          notice_version: string
          parent_email: string
        }
        Insert: {
          child_user_id?: string | null
          consent_given_at?: string
          consent_ip_address?: unknown | null
          consent_method?: string
          created_at?: string
          id?: string
          is_active?: boolean
          notice_version?: string
          parent_email: string
        }
        Update: {
          child_user_id?: string | null
          consent_given_at?: string
          consent_ip_address?: unknown | null
          consent_method?: string
          created_at?: string
          id?: string
          is_active?: boolean
          notice_version?: string
          parent_email?: string
        }
        Relationships: []
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
