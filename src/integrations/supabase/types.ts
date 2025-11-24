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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      drift_runs: {
        Row: {
          baseline_id: string
          created_at: string
          current_rows: number
          dataset_id: string
          drift_ratio: number
          drifted_features: Json
          dsi: number
          id: string
          project_id: string
          reference_rows: number
        }
        Insert: {
          baseline_id: string
          created_at?: string
          current_rows: number
          dataset_id: string
          drift_ratio: number
          drifted_features?: Json
          dsi: number
          id?: string
          project_id: string
          reference_rows: number
        }
        Update: {
          baseline_id?: string
          created_at?: string
          current_rows?: number
          dataset_id?: string
          drift_ratio?: number
          drifted_features?: Json
          dsi?: number
          id?: string
          project_id?: string
          reference_rows?: number
        }
        Relationships: [
          {
            foreignKeyName: "drift_runs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      monai_alerts: {
        Row: {
          channel: string | null
          id: string
          message: string
          payload_json: Json | null
          project_id: string
          resolved_at: string | null
          severity: string
          status: string | null
          title: string
          triggered_at: string
          type: string
        }
        Insert: {
          channel?: string | null
          id?: string
          message: string
          payload_json?: Json | null
          project_id: string
          resolved_at?: string | null
          severity: string
          status?: string | null
          title: string
          triggered_at?: string
          type: string
        }
        Update: {
          channel?: string | null
          id?: string
          message?: string
          payload_json?: Json | null
          project_id?: string
          resolved_at?: string | null
          severity?: string
          status?: string | null
          title?: string
          triggered_at?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "monai_alerts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "monai_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      monai_api_keys: {
        Row: {
          created_at: string
          environment: string
          hashed_key: string
          id: string
          is_active: boolean
          last_four: string
          last_used_at: string | null
          name: string
          prefix: string
          project_id: string
        }
        Insert: {
          created_at?: string
          environment?: string
          hashed_key: string
          id?: string
          is_active?: boolean
          last_four: string
          last_used_at?: string | null
          name: string
          prefix: string
          project_id: string
        }
        Update: {
          created_at?: string
          environment?: string
          hashed_key?: string
          id?: string
          is_active?: boolean
          last_four?: string
          last_used_at?: string | null
          name?: string
          prefix?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monai_api_keys_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "monai_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      monai_datasets: {
        Row: {
          created_at: string
          id: string
          kind: string
          name: string
          project_id: string
          row_count: number | null
          schema_json: Json | null
          source_type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          name: string
          project_id: string
          row_count?: number | null
          schema_json?: Json | null
          source_type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          name?: string
          project_id?: string
          row_count?: number | null
          schema_json?: Json | null
          source_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monai_datasets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "monai_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      monai_drift_feature_metrics: {
        Row: {
          details_json: Json | null
          drift_flag: boolean
          drift_run_id: string
          feature_name: string
          feature_type: string
          id: string
          js_divergence: number | null
          kl_divergence: number | null
          p_value: number | null
          psi: number | null
        }
        Insert: {
          details_json?: Json | null
          drift_flag?: boolean
          drift_run_id: string
          feature_name: string
          feature_type: string
          id?: string
          js_divergence?: number | null
          kl_divergence?: number | null
          p_value?: number | null
          psi?: number | null
        }
        Update: {
          details_json?: Json | null
          drift_flag?: boolean
          drift_run_id?: string
          feature_name?: string
          feature_type?: string
          id?: string
          js_divergence?: number | null
          kl_divergence?: number | null
          p_value?: number | null
          psi?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "monai_drift_feature_metrics_drift_run_id_fkey"
            columns: ["drift_run_id"]
            isOneToOne: false
            referencedRelation: "monai_drift_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      monai_drift_runs: {
        Row: {
          baseline_dataset_id: string
          created_at: string
          current_dataset_id: string
          drift_ratio: number
          dsi: number
          id: string
          metrics_json: Json | null
          project_id: string
          status: string | null
          summary: string | null
        }
        Insert: {
          baseline_dataset_id: string
          created_at?: string
          current_dataset_id: string
          drift_ratio: number
          dsi: number
          id?: string
          metrics_json?: Json | null
          project_id: string
          status?: string | null
          summary?: string | null
        }
        Update: {
          baseline_dataset_id?: string
          created_at?: string
          current_dataset_id?: string
          drift_ratio?: number
          dsi?: number
          id?: string
          metrics_json?: Json | null
          project_id?: string
          status?: string | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monai_drift_runs_baseline_dataset_id_fkey"
            columns: ["baseline_dataset_id"]
            isOneToOne: false
            referencedRelation: "monai_datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monai_drift_runs_current_dataset_id_fkey"
            columns: ["current_dataset_id"]
            isOneToOne: false
            referencedRelation: "monai_datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monai_drift_runs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "monai_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      monai_embedding_vectors: {
        Row: {
          cluster_label: string | null
          created_at: string
          dataset_id: string | null
          id: string
          interaction_id: string | null
          project_id: string
          vector: Json
        }
        Insert: {
          cluster_label?: string | null
          created_at?: string
          dataset_id?: string | null
          id?: string
          interaction_id?: string | null
          project_id: string
          vector: Json
        }
        Update: {
          cluster_label?: string | null
          created_at?: string
          dataset_id?: string | null
          id?: string
          interaction_id?: string | null
          project_id?: string
          vector?: Json
        }
        Relationships: [
          {
            foreignKeyName: "monai_embedding_vectors_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "monai_datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monai_embedding_vectors_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "monai_llm_interactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monai_embedding_vectors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "monai_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      monai_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload_json: Json
          project_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload_json: Json
          project_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload_json?: Json
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monai_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "monai_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      monai_llm_interactions: {
        Row: {
          created_at: string
          hallucination_score: number | null
          id: string
          input_text: string
          metadata_json: Json | null
          output_text: string
          project_id: string
          safety_flags_json: Json | null
          tone: string | null
        }
        Insert: {
          created_at?: string
          hallucination_score?: number | null
          id?: string
          input_text: string
          metadata_json?: Json | null
          output_text: string
          project_id: string
          safety_flags_json?: Json | null
          tone?: string | null
        }
        Update: {
          created_at?: string
          hallucination_score?: number | null
          id?: string
          input_text?: string
          metadata_json?: Json | null
          output_text?: string
          project_id?: string
          safety_flags_json?: Json | null
          tone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monai_llm_interactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "monai_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      monai_projects: {
        Row: {
          created_at: string
          default_model_type: string | null
          description: string | null
          id: string
          is_demo: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_model_type?: string | null
          description?: string | null
          id?: string
          is_demo?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_model_type?: string | null
          description?: string | null
          id?: string
          is_demo?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_settings: {
        Row: {
          drift_ratio_threshold: number
          dsi_threshold: number
          id: string
          project_id: string
          slack_webhook_url: string | null
        }
        Insert: {
          drift_ratio_threshold?: number
          dsi_threshold?: number
          id?: string
          project_id: string
          slack_webhook_url?: string | null
        }
        Update: {
          drift_ratio_threshold?: number
          dsi_threshold?: number
          id?: string
          project_id?: string
          slack_webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_settings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
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
