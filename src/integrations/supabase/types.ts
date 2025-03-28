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
      consultation_recipes: {
        Row: {
          administration_method: string | null
          consultation_id: string | null
          created_at: string | null
          dose: string | null
          id: string
          is_continuous: boolean | null
          name: string
        }
        Insert: {
          administration_method?: string | null
          consultation_id?: string | null
          created_at?: string | null
          dose?: string | null
          id?: string
          is_continuous?: boolean | null
          name: string
        }
        Update: {
          administration_method?: string | null
          consultation_id?: string | null
          created_at?: string | null
          dose?: string | null
          id?: string
          is_continuous?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_recipes_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_types: {
        Row: {
          accepts_insurance: boolean | null
          created_at: string | null
          doctor_id: string | null
          duration: unknown
          id: string
          name: string
        }
        Insert: {
          accepts_insurance?: boolean | null
          created_at?: string | null
          doctor_id?: string | null
          duration: unknown
          id?: string
          name: string
        }
        Update: {
          accepts_insurance?: boolean | null
          created_at?: string | null
          doctor_id?: string | null
          duration?: unknown
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_types_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          assessment: string | null
          consultation_type_id: string | null
          created_at: string | null
          doctor_id: string | null
          end_time: string
          id: string
          objective: string | null
          patient_id: string | null
          payment_method: Database["public"]["Enums"]["payment_form"] | null
          plan: string | null
          start_time: string
          status: Database["public"]["Enums"]["consultation_status"] | null
          subjective: string | null
        }
        Insert: {
          assessment?: string | null
          consultation_type_id?: string | null
          created_at?: string | null
          doctor_id?: string | null
          end_time: string
          id?: string
          objective?: string | null
          patient_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_form"] | null
          plan?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["consultation_status"] | null
          subjective?: string | null
        }
        Update: {
          assessment?: string | null
          consultation_type_id?: string | null
          created_at?: string | null
          doctor_id?: string | null
          end_time?: string
          id?: string
          objective?: string | null
          patient_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_form"] | null
          plan?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["consultation_status"] | null
          subjective?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultations_consultation_type_id_fkey"
            columns: ["consultation_type_id"]
            isOneToOne: false
            referencedRelation: "consultation_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_tag_links: {
        Row: {
          conversation_id: string
          tag_id: string
        }
        Insert: {
          conversation_id: string
          tag_id: string
        }
        Update: {
          conversation_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_tag_links_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_tag_links_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "conversation_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_tags: {
        Row: {
          color: string | null
          created_at: string | null
          doctor_id: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_tags_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          channel: string | null
          created_at: string | null
          id: string
          is_archived: boolean | null
          last_activity: string | null
          patient_id: string | null
          unread_count: number | null
        }
        Insert: {
          channel?: string | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          last_activity?: string | null
          patient_id?: string | null
          unread_count?: number | null
        }
        Update: {
          channel?: string | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          last_activity?: string | null
          patient_id?: string | null
          unread_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_availability: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          doctor_id: string | null
          end_time: string
          id: string
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          doctor_id?: string | null
          end_time: string
          id?: string
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          doctor_id?: string | null
          end_time?: string
          id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_availability_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_unavailability: {
        Row: {
          created_at: string | null
          doctor_id: string | null
          end_time: string
          id: string
          reason: string | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          doctor_id?: string | null
          end_time: string
          id?: string
          reason?: string | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          doctor_id?: string | null
          end_time?: string
          id?: string
          reason?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_unavailability_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          abdominal_circumference: number | null
          created_at: string | null
          height: number | null
          id: string
          imc: number | null
          patient_id: string | null
          weight: number | null
        }
        Insert: {
          abdominal_circumference?: number | null
          created_at?: string | null
          height?: number | null
          id?: string
          imc?: number | null
          patient_id?: string | null
          weight?: number | null
        }
        Update: {
          abdominal_circumference?: number | null
          created_at?: string | null
          height?: number | null
          id?: string
          imc?: number | null
          patient_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          is_outgoing: boolean
          status: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_outgoing: boolean
          status?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_outgoing?: boolean
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: Json | null
          biological_sex: Database["public"]["Enums"]["biological_sex"] | null
          cpf: string | null
          created_at: string | null
          date_of_birth: string | null
          doctor_id: string | null
          email: string | null
          full_name: string
          gender_identity: Database["public"]["Enums"]["gender_identity"] | null
          id: string
          notes: string | null
          payment_form: Database["public"]["Enums"]["payment_form"] | null
          phone: string | null
        }
        Insert: {
          address?: Json | null
          biological_sex?: Database["public"]["Enums"]["biological_sex"] | null
          cpf?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          doctor_id?: string | null
          email?: string | null
          full_name: string
          gender_identity?:
            | Database["public"]["Enums"]["gender_identity"]
            | null
          id?: string
          notes?: string | null
          payment_form?: Database["public"]["Enums"]["payment_form"] | null
          phone?: string | null
        }
        Update: {
          address?: Json | null
          biological_sex?: Database["public"]["Enums"]["biological_sex"] | null
          cpf?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          doctor_id?: string | null
          email?: string | null
          full_name?: string
          gender_identity?:
            | Database["public"]["Enums"]["gender_identity"]
            | null
          id?: string
          notes?: string | null
          payment_form?: Database["public"]["Enums"]["payment_form"] | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accepts_insurance: boolean | null
          created_at: string | null
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          accepts_insurance?: boolean | null
          created_at?: string | null
          full_name: string
          id: string
          phone?: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          accepts_insurance?: boolean | null
          created_at?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      record_exams: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          is_abnormal: boolean | null
          name: string
          record_id: string | null
          reference_value: string | null
          result: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          is_abnormal?: boolean | null
          name: string
          record_id?: string | null
          reference_value?: string | null
          result?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          is_abnormal?: boolean | null
          name?: string
          record_id?: string | null
          reference_value?: string | null
          result?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "record_exams_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "medical_records"
            referencedColumns: ["id"]
          },
        ]
      }
      record_medications: {
        Row: {
          created_at: string | null
          dosage: string | null
          frequency: string | null
          id: string
          name: string
          record_id: string | null
        }
        Insert: {
          created_at?: string | null
          dosage?: string | null
          frequency?: string | null
          id?: string
          name: string
          record_id?: string | null
        }
        Update: {
          created_at?: string | null
          dosage?: string | null
          frequency?: string | null
          id?: string
          name?: string
          record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "record_medications_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "medical_records"
            referencedColumns: ["id"]
          },
        ]
      }
      record_problems: {
        Row: {
          ciap: string | null
          cid: string | null
          created_at: string | null
          id: string
          name: string
          record_id: string | null
        }
        Insert: {
          ciap?: string | null
          cid?: string | null
          created_at?: string | null
          id?: string
          name: string
          record_id?: string | null
        }
        Update: {
          ciap?: string | null
          cid?: string | null
          created_at?: string | null
          id?: string
          name?: string
          record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "record_problems_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "medical_records"
            referencedColumns: ["id"]
          },
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
