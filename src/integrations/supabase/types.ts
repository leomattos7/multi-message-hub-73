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
      appointments: {
        Row: {
          created_at: string
          date: string
          doctor_id: string | null
          end_time: string | null
          id: string
          notes: string | null
          patient_id: string
          payment_method: string | null
          status: string
          time: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          doctor_id?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          payment_method?: string | null
          status?: string
          time: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          doctor_id?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          payment_method?: string | null
          status?: string
          time?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          doctor_id: string
          end_time: string
          event_type: string
          id: string
          start_time: string
          title: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          doctor_id: string
          end_time: string
          event_type: string
          id?: string
          start_time: string
          title: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          doctor_id?: string
          end_time?: string
          event_type?: string
          id?: string
          start_time?: string
          title?: string
        }
        Relationships: []
      }
      chat_transcripts: {
        Row: {
          created_at: string | null
          id: string
          phone: string
          transcript: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          phone: string
          transcript: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          phone?: string
          transcript?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      consultation_types: {
        Row: {
          created_at: string
          doctor_id: string
          duration: number
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          duration: number
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          duration?: number
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversation_tags: {
        Row: {
          color: string
          created_at: string
          doctor_id: string
          id: string
          name: string
        }
        Insert: {
          color: string
          created_at?: string
          doctor_id: string
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          doctor_id?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      conversation_to_tag: {
        Row: {
          conversation_id: string
          created_at: string
          tag_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          tag_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          tag_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          channel: string
          created_at: string
          doctor_id: string | null
          id: string
          is_archived: boolean
          last_activity: string
          patient_id: string
          unread: number | null
        }
        Insert: {
          channel: string
          created_at?: string
          doctor_id?: string | null
          id?: string
          is_archived?: boolean
          last_activity?: string
          patient_id: string
          unread?: number | null
        }
        Update: {
          channel?: string
          created_at?: string
          doctor_id?: string | null
          id?: string
          is_archived?: boolean
          last_activity?: string
          patient_id?: string
          unread?: number | null
        }
        Relationships: []
      }
      doctor_availability: {
        Row: {
          created_at: string
          day_of_week: number
          doctor_id: string
          end_time: string
          id: string
          is_available: boolean
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          doctor_id: string
          end_time: string
          id?: string
          is_available?: boolean
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          doctor_id?: string
          end_time?: string
          id?: string
          is_available?: boolean
          start_time?: string
        }
        Relationships: []
      }
      doctor_links: {
        Row: {
          created_at: string
          display_order: number
          doctor_id: string
          icon: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          display_order: number
          doctor_id: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          doctor_id?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      doctor_profiles: {
        Row: {
          address: string | null
          bio: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          profile_image_url: string | null
          public_url_slug: string
          specialty: string | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          profile_image_url?: string | null
          public_url_slug: string
          specialty?: string | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          profile_image_url?: string | null
          public_url_slug?: string
          specialty?: string | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          date_added: string
          email: string
          id: string
          name: string
          role: string
          status: string
        }
        Insert: {
          date_added?: string
          email: string
          id?: string
          name: string
          role: string
          status?: string
        }
        Update: {
          date_added?: string
          email?: string
          id?: string
          name?: string
          role?: string
          status?: string
        }
        Relationships: []
      }
      lab_exams: {
        Row: {
          created_at: string
          exam_date: string
          id: string
          is_abnormal: boolean
          name: string
          patient_id: string
          reference_range: string | null
          result: string
        }
        Insert: {
          created_at?: string
          exam_date: string
          id?: string
          is_abnormal?: boolean
          name: string
          patient_id: string
          reference_range?: string | null
          result: string
        }
        Update: {
          created_at?: string
          exam_date?: string
          id?: string
          is_abnormal?: boolean
          name?: string
          patient_id?: string
          reference_range?: string | null
          result?: string
        }
        Relationships: []
      }
      measurements: {
        Row: {
          created_at: string
          date: string
          id: string
          name: string
          patient_id: string
          unit: string
          value: number
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          name: string
          patient_id: string
          unit: string
          value: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          name?: string
          patient_id?: string
          unit?: string
          value?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          id: string
          is_outgoing: boolean
          status: string
          timestamp: string
        }
        Insert: {
          content: string
          conversation_id: string
          id?: string
          is_outgoing?: boolean
          status: string
          timestamp?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          id?: string
          is_outgoing?: boolean
          status?: string
          timestamp?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      patient_records: {
        Row: {
          content: string
          created_at: string
          id: string
          patient_id: string
          record_date: string
          record_type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          patient_id: string
          record_date?: string
          record_type: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          patient_id?: string
          record_date?: string
          record_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          address: string | null
          avatar_url: string | null
          biological_sex: string | null
          birth_date: string | null
          cpf: string | null
          created_at: string
          doctor_id: string | null
          email: string | null
          gender_identity: string | null
          id: string
          insurance_name: string | null
          name: string
          notes: string | null
          payment_method: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          biological_sex?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          doctor_id?: string | null
          email?: string | null
          gender_identity?: string | null
          id?: string
          insurance_name?: string | null
          name: string
          notes?: string | null
          payment_method?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          biological_sex?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          doctor_id?: string | null
          email?: string | null
          gender_identity?: string | null
          id?: string
          insurance_name?: string | null
          name?: string
          notes?: string | null
          payment_method?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          organization_id: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name: string
          organization_id?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          role?: string
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
      app_role: "owner" | "doctor" | "secretary"
      biological_sex: "Masculino" | "Feminino" | "Intersexo" | "Não Informado"
      consultation_status: "aguardando" | "confirmado" | "cancelado"
      gender_identity:
        | "Homem"
        | "Mulher"
        | "Não-Binário"
        | "Outro"
        | "Não Informado"
      payment_form: "Particular" | "Convênio"
      user_role: "admin" | "employee" | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
