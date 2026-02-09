export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      charities: {
        Row: {
          accepts_direct_donation: boolean | null
          admin_expense_percentage: number | null
          allows_donation_tracking: boolean | null
          allows_donor_recipient_contact: boolean | null
          annual_report_url: string | null
          city: string | null
          community_rating_average: number | null
          community_rating_count: number | null
          complete_990_filed: boolean | null
          country: string | null
          created_at: string
          ein: string | null
          financials_published: boolean | null
          full_description: string | null
          fundraising_expense_percentage: number | null
          geographic_scope: Database["public"]["Enums"]["geographic_scope"]
          headquarters: string | null
          id: string
          logo_url: string | null
          mission_statement: string | null
          name: string
          offers_donor_perks: boolean | null
          people_served_annually: number | null
          primary_category: Database["public"]["Enums"]["cause_category"]
          program_expense_percentage: number | null
          programs_list: string[] | null
          score_financial_efficiency: number | null
          score_impact: number | null
          score_longevity: number | null
          score_overall: number | null
          score_transparency: number | null
          state: string | null
          target_population: string | null
          updated_at: string
          website: string | null
          year_founded: number | null
        }
        Insert: {
          accepts_direct_donation?: boolean | null
          admin_expense_percentage?: number | null
          allows_donation_tracking?: boolean | null
          allows_donor_recipient_contact?: boolean | null
          annual_report_url?: string | null
          city?: string | null
          community_rating_average?: number | null
          community_rating_count?: number | null
          complete_990_filed?: boolean | null
          country?: string | null
          created_at?: string
          ein?: string | null
          financials_published?: boolean | null
          full_description?: string | null
          fundraising_expense_percentage?: number | null
          geographic_scope?: Database["public"]["Enums"]["geographic_scope"]
          headquarters?: string | null
          id?: string
          logo_url?: string | null
          mission_statement?: string | null
          name: string
          offers_donor_perks?: boolean | null
          people_served_annually?: number | null
          primary_category: Database["public"]["Enums"]["cause_category"]
          program_expense_percentage?: number | null
          programs_list?: string[] | null
          score_financial_efficiency?: number | null
          score_impact?: number | null
          score_longevity?: number | null
          score_overall?: number | null
          score_transparency?: number | null
          state?: string | null
          target_population?: string | null
          updated_at?: string
          website?: string | null
          year_founded?: number | null
        }
        Update: {
          accepts_direct_donation?: boolean | null
          admin_expense_percentage?: number | null
          allows_donation_tracking?: boolean | null
          allows_donor_recipient_contact?: boolean | null
          annual_report_url?: string | null
          city?: string | null
          community_rating_average?: number | null
          community_rating_count?: number | null
          complete_990_filed?: boolean | null
          country?: string | null
          created_at?: string
          ein?: string | null
          financials_published?: boolean | null
          full_description?: string | null
          fundraising_expense_percentage?: number | null
          geographic_scope?: Database["public"]["Enums"]["geographic_scope"]
          headquarters?: string | null
          id?: string
          logo_url?: string | null
          mission_statement?: string | null
          name?: string
          offers_donor_perks?: boolean | null
          people_served_annually?: number | null
          primary_category?: Database["public"]["Enums"]["cause_category"]
          program_expense_percentage?: number | null
          programs_list?: string[] | null
          score_financial_efficiency?: number | null
          score_impact?: number | null
          score_longevity?: number | null
          score_overall?: number | null
          score_transparency?: number | null
          state?: string | null
          target_population?: string | null
          updated_at?: string
          website?: string | null
          year_founded?: number | null
        }
        Relationships: []
      }
      community_reviews: {
        Row: {
          id: string
          charity_id: string
          donor_name: string
          verified: boolean
          rating: number
          rating_impact: number | null
          rating_communication: number | null
          rating_transparency: number | null
          rating_experience: number | null
          review_text: string
          donation_amount: number | null
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          charity_id: string
          donor_name: string
          verified?: boolean
          rating: number
          rating_impact?: number | null
          rating_communication?: number | null
          rating_transparency?: number | null
          rating_experience?: number | null
          review_text: string
          donation_amount?: number | null
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          charity_id?: string
          donor_name?: string
          verified?: boolean
          rating?: number
          rating_impact?: number | null
          rating_communication?: number | null
          rating_transparency?: number | null
          rating_experience?: number | null
          review_text?: string
          donation_amount?: number | null
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_reviews_charity_id_fkey"
            columns: ["charity_id"]
            isOneToOne: false
            referencedRelation: "charities"
            referencedColumns: ["id"]
          }
        ]
      }
      online_review_sources: {
        Row: {
          id: string
          charity_id: string
          source_name: string
          display_name: string
          rating: number | null
          max_rating: number
          rating_scale: string
          review_count: number | null
          source_url: string | null
          note: string | null
          last_updated: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          charity_id: string
          source_name: string
          display_name: string
          rating?: number | null
          max_rating: number
          rating_scale?: string
          review_count?: number | null
          source_url?: string | null
          note?: string | null
          last_updated?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          charity_id?: string
          source_name?: string
          display_name?: string
          rating?: number | null
          max_rating?: number
          rating_scale?: string
          review_count?: number | null
          source_url?: string | null
          note?: string | null
          last_updated?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "online_review_sources_charity_id_fkey"
            columns: ["charity_id"]
            isOneToOne: false
            referencedRelation: "charities"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      cause_category:
        | "rare-diseases"
        | "medical-health"
        | "education"
        | "hunger-food-security"
        | "animal-welfare"
        | "child-welfare"
        | "environment-climate"
        | "emergency-relief"
        | "housing-homelessness"
        | "mental-health"
        | "veterans"
        | "arts-culture"
        | "human-rights"
        | "disability-services"
        | "senior-services"
        | "community-development"
        | "faith-based"
        | "international-development"
      geographic_scope: "local" | "national" | "global"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cause_category: [
        "rare-diseases",
        "medical-health",
        "education",
        "hunger-food-security",
        "animal-welfare",
        "child-welfare",
        "environment-climate",
        "emergency-relief",
        "housing-homelessness",
        "mental-health",
        "veterans",
        "arts-culture",
        "human-rights",
        "disability-services",
        "senior-services",
        "community-development",
        "faith-based",
        "international-development",
      ],
      geographic_scope: ["local", "national", "global"],
    },
  },
} as const
