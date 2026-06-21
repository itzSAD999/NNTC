export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type StaffRole =
  | "super_admin"
  | "content_editor"
  | "academic"
  | "accounts"
  | "principal";

export type RequestStatus =
  | "submitted"
  | "returned"
  | "academic_approved"
  | "payment_confirmed"
  | "approved"
  | "collected";

export type DeliveryMethod = "collection" | "email";

export type Database = {
  public: {
    Tables: {
      settings: {
        Row: {
          id: number;
          college_name: string;
          motto: string;
          logo_url: string | null;
          primary_color: string | null;
          accent_color: string | null;
          phone_main: string | null;
          phone_admissions: string | null;
          phone_finance: string | null;
          email_main: string | null;
          email_admissions: string | null;
          email_finance: string | null;
          address: string | null;
          google_maps_url: string | null;
          office_hours: string | null;
          facebook_url: string | null;
          instagram_url: string | null;
          x_url: string | null;
          whatsapp: string | null;
          domain: string | null;
          default_language: string;
          notification_email_template: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          college_name?: string;
          motto?: string;
          logo_url?: string | null;
          primary_color?: string | null;
          accent_color?: string | null;
          phone_main?: string | null;
          phone_admissions?: string | null;
          phone_finance?: string | null;
          email_main?: string | null;
          email_admissions?: string | null;
          email_finance?: string | null;
          address?: string | null;
          google_maps_url?: string | null;
          office_hours?: string | null;
          facebook_url?: string | null;
          instagram_url?: string | null;
          x_url?: string | null;
          whatsapp?: string | null;
          domain?: string | null;
          default_language?: string;
          notification_email_template?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          college_name?: string;
          motto?: string;
          logo_url?: string | null;
          primary_color?: string | null;
          accent_color?: string | null;
          phone_main?: string | null;
          phone_admissions?: string | null;
          phone_finance?: string | null;
          email_main?: string | null;
          email_admissions?: string | null;
          email_finance?: string | null;
          address?: string | null;
          google_maps_url?: string | null;
          office_hours?: string | null;
          facebook_url?: string | null;
          instagram_url?: string | null;
          x_url?: string | null;
          whatsapp?: string | null;
          domain?: string | null;
          default_language?: string;
          notification_email_template?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      about_content: {
        Row: {
          id: number;
          history: string;
          vision: string;
          mission: string;
          core_values: string[];
          principal_name: string | null;
          principal_title: string | null;
          principal_message: string;
          principal_photo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          history?: string;
          vision?: string;
          mission?: string;
          core_values?: string[];
          principal_name?: string | null;
          principal_title?: string | null;
          principal_message?: string;
          principal_photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          history?: string;
          vision?: string;
          mission?: string;
          core_values?: string[];
          principal_name?: string | null;
          principal_title?: string | null;
          principal_message?: string;
          principal_photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      accreditations: {
        Row: {
          id: string;
          body_name: string;
          accreditation_no: string | null;
          logo_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          body_name: string;
          accreditation_no?: string | null;
          logo_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          body_name?: string;
          accreditation_no?: string | null;
          logo_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      staff_accounts: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: StaffRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role: StaffRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: StaffRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      document_types: {
        Row: {
          id: string;
          name: string;
          code: string;
          fee_amount: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          fee_amount: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          fee_amount?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          body: string;
          excerpt: string;
          category: string;
          cover_image_url: string | null;
          is_pinned: boolean;
          published_at: string | null;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          body?: string;
          excerpt?: string;
          category?: string;
          cover_image_url?: string | null;
          is_pinned?: boolean;
          published_at?: string | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          body?: string;
          excerpt?: string;
          category?: string;
          cover_image_url?: string | null;
          is_pinned?: boolean;
          published_at?: string | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "staff_accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      requests: {
        Row: {
          id: string;
          reference_no: string;
          student_name: string;
          student_id: string;
          student_email: string;
          student_phone: string | null;
          program: string;
          year_completed: string;
          document_type_id: string;
          purpose: string;
          delivery_method: DeliveryMethod;
          status: RequestStatus;
          receipt_url: string | null;
          amount_expected: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference_no: string;
          student_name: string;
          student_id: string;
          student_email: string;
          student_phone?: string | null;
          program: string;
          year_completed: string;
          document_type_id: string;
          purpose: string;
          delivery_method: DeliveryMethod;
          status?: RequestStatus;
          receipt_url?: string | null;
          amount_expected: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reference_no?: string;
          student_name?: string;
          student_id?: string;
          student_email?: string;
          student_phone?: string | null;
          program?: string;
          year_completed?: string;
          document_type_id?: string;
          purpose?: string;
          delivery_method?: DeliveryMethod;
          status?: RequestStatus;
          receipt_url?: string | null;
          amount_expected?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "requests_document_type_id_fkey";
            columns: ["document_type_id"];
            isOneToOne: false;
            referencedRelation: "document_types";
            referencedColumns: ["id"];
          },
        ];
      };
      request_events: {
        Row: {
          id: string;
          request_id: string;
          actor_id: string | null;
          actor_label: string;
          action: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          actor_id?: string | null;
          actor_label: string;
          action: string;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          actor_id?: string | null;
          actor_label?: string;
          action?: string;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "request_events_request_id_fkey";
            columns: ["request_id"];
            isOneToOne: false;
            referencedRelation: "requests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "request_events_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "staff_accounts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      staff_role: StaffRole;
      request_status: RequestStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Accreditation =
  Database["public"]["Tables"]["accreditations"]["Row"];
export type Settings = Database["public"]["Tables"]["settings"]["Row"];
export type AboutContent = Database["public"]["Tables"]["about_content"]["Row"];
export type StaffAccount = Database["public"]["Tables"]["staff_accounts"]["Row"];
export type DocumentType = Database["public"]["Tables"]["document_types"]["Row"];
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type ContactMessage =
  Database["public"]["Tables"]["contact_messages"]["Row"];
export type Request = Database["public"]["Tables"]["requests"]["Row"];
export type RequestEvent = Database["public"]["Tables"]["request_events"]["Row"];
