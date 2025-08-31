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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      cash_register: {
        Row: {
          closed_at: string | null
          closing_balance: number | null
          id: string
          is_open: boolean | null
          opened_at: string
          opening_balance: number
          total_card: number | null
          total_cash: number | null
          total_pix: number | null
          total_sales: number | null
        }
        Insert: {
          closed_at?: string | null
          closing_balance?: number | null
          id?: string
          is_open?: boolean | null
          opened_at?: string
          opening_balance?: number
          total_card?: number | null
          total_cash?: number | null
          total_pix?: number | null
          total_sales?: number | null
        }
        Update: {
          closed_at?: string | null
          closing_balance?: number | null
          id?: string
          is_open?: boolean | null
          opened_at?: string
          opening_balance?: number
          total_card?: number | null
          total_cash?: number | null
          total_pix?: number | null
          total_sales?: number | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: Json | null
          client_type: string | null
          created_at: string
          email: string | null
          id: string
          last_purchase_date: string | null
          name: string
          phone: string | null
          total_purchases: number | null
          updated_at: string
        }
        Insert: {
          address?: Json | null
          client_type?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_purchase_date?: string | null
          name: string
          phone?: string | null
          total_purchases?: number | null
          updated_at?: string
        }
        Update: {
          address?: Json | null
          client_type?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_purchase_date?: string | null
          name?: string
          phone?: string | null
          total_purchases?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          client_id: string | null
          consignment_due_date: string | null
          created_at: string
          id: string
          is_consignment: boolean | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          consignment_due_date?: string | null
          created_at?: string
          id?: string
          is_consignment?: boolean | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          consignment_due_date?: string | null
          created_at?: string
          id?: string
          is_consignment?: boolean | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          cost_price: number | null
          created_at: string
          description: string | null
          id: string
          minimum_stock: number | null
          name: string
          price: number
          qr_code: string
          short_code: string
          status: Database["public"]["Enums"]["product_status"] | null
          stock_quantity: number
          supplier: string | null
          updated_at: string
        }
        Insert: {
          category: string
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          minimum_stock?: number | null
          name: string
          price: number
          qr_code: string
          short_code: string
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number
          supplier?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          minimum_stock?: number | null
          name?: string
          price?: number
          qr_code?: string
          short_code?: string
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number
          supplier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          order_id: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_product_short_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_qr_code_data: {
        Args: { product_id: string; short_code: string }
        Returns: string
      }
    }
    Enums: {
      order_status: "pending" | "completed" | "cancelled" | "consignment"
      payment_method: "cash" | "card" | "pix" | "consignment"
      product_status: "active" | "inactive" | "out_of_stock"
      transaction_type:
        | "sale"
        | "consignment_open"
        | "consignment_close"
        | "return"
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
      order_status: ["pending", "completed", "cancelled", "consignment"],
      payment_method: ["cash", "card", "pix", "consignment"],
      product_status: ["active", "inactive", "out_of_stock"],
      transaction_type: [
        "sale",
        "consignment_open",
        "consignment_close",
        "return",
      ],
    },
  },
} as const
