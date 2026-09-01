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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      customer_adoption_weeks: {
        Row: {
          actual: number | null
          created_at: string
          customer_id: string
          id: string
          position: number
          projected: number | null
          target: number | null
          week_label: string
        }
        Insert: {
          actual?: number | null
          created_at?: string
          customer_id: string
          id?: string
          position?: number
          projected?: number | null
          target?: number | null
          week_label: string
        }
        Update: {
          actual?: number | null
          created_at?: string
          customer_id?: string
          id?: string
          position?: number
          projected?: number | null
          target?: number | null
          week_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_adoption_weeks_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_cases: {
        Row: {
          age: string | null
          created_at: string
          customer_id: string
          id: string
          position: number
          reference: string
          severity: string
          status: string
          title: string
          workflow_area: string | null
        }
        Insert: {
          age?: string | null
          created_at?: string
          customer_id: string
          id?: string
          position?: number
          reference: string
          severity?: string
          status?: string
          title: string
          workflow_area?: string | null
        }
        Update: {
          age?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          position?: number
          reference?: string
          severity?: string
          status?: string
          title?: string
          workflow_area?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_cases_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_metrics: {
        Row: {
          created_at: string
          customer_id: string
          delta: string
          id: string
          label: string
          position: number
          tone: string
          value: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          delta?: string
          id?: string
          label: string
          position?: number
          tone?: string
          value: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          delta?: string
          id?: string
          label?: string
          position?: number
          tone?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_metrics_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_qbr_sections: {
        Row: {
          body: string
          created_at: string
          customer_id: string
          evidence_source: string | null
          heading: string
          id: string
          position: number
        }
        Insert: {
          body: string
          created_at?: string
          customer_id: string
          evidence_source?: string | null
          heading: string
          id?: string
          position?: number
        }
        Update: {
          body?: string
          created_at?: string
          customer_id?: string
          evidence_source?: string | null
          heading?: string
          id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "customer_qbr_sections_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_stakeholders: {
        Row: {
          created_at: string
          customer_id: string
          engagement: string | null
          id: string
          lens: string | null
          name: string
          position: number
          recommendation: string | null
          role: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          engagement?: string | null
          id?: string
          lens?: string | null
          name: string
          position?: number
          recommendation?: string | null
          role: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          engagement?: string | null
          id?: string
          lens?: string | null
          name?: string
          position?: number
          recommendation?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_stakeholders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          acv: string | null
          blocker: string | null
          champion: string | null
          created_at: string
          health_score: number
          id: string
          name: string
          next_moment: string | null
          outcome: string
          outcome_status: string
          progress: number
          quarter: string
          renewal_window: string | null
          segment: string
          short_name: string
          slug: string
          sponsor: string | null
          updated_at: string
        }
        Insert: {
          acv?: string | null
          blocker?: string | null
          champion?: string | null
          created_at?: string
          health_score?: number
          id?: string
          name: string
          next_moment?: string | null
          outcome: string
          outcome_status?: string
          progress?: number
          quarter: string
          renewal_window?: string | null
          segment: string
          short_name: string
          slug: string
          sponsor?: string | null
          updated_at?: string
        }
        Update: {
          acv?: string | null
          blocker?: string | null
          champion?: string | null
          created_at?: string
          health_score?: number
          id?: string
          name?: string
          next_moment?: string | null
          outcome?: string
          outcome_status?: string
          progress?: number
          quarter?: string
          renewal_window?: string | null
          segment?: string
          short_name?: string
          slug?: string
          sponsor?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
