export type Database = {
  public: {
    Tables: {
      negocios: {
        Row: {
          id: string;
          nombre: string;
          categoria: "Comer" | "Dormir" | "Qué hacer" | "Comercio local" | "Naturaleza" | "Pueblos";
          municipio: string;
          descripcion: string;
          imagen: string | null;
          abierto: boolean | null;
          badges: string[];
          direccion: string | null;
          lat: number | null;
          lng: number | null;
          owner_id: string | null;
          fotos: string[];
          video_url: string | null;
          audio_url: string | null;
          telefono: string | null;
          email: string | null;
          web: string | null;
          instagram: string | null;
          facebook: string | null;
          whatsapp: string | null;
          horario: string | null;
          aprobado: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          categoria: "Comer" | "Dormir" | "Qué hacer" | "Comercio local" | "Naturaleza" | "Pueblos";
          municipio: string;
          descripcion?: string;
          imagen?: string | null;
          abierto?: boolean | null;
          badges?: string[];
          direccion?: string | null;
          lat?: number | null;
          lng?: number | null;
          owner_id?: string | null;
          fotos?: string[];
          video_url?: string | null;
          audio_url?: string | null;
          telefono?: string | null;
          email?: string | null;
          web?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          whatsapp?: string | null;
          horario?: string | null;
          aprobado?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["negocios"]["Insert"]>;
      };
      historias: {
        Row: {
          id: string;
          persona: string;
          negocio: string;
          municipio: string;
          titulo: string;
          imagen: string | null;
          audio_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          persona: string;
          negocio: string;
          municipio: string;
          titulo: string;
          imagen?: string | null;
          audio_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["historias"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          nombre: string;
          avatar_url: string | null;
          role: "cliente" | "comercio" | null;
          distintivo: boolean;
          municipio: string | null;
          es_admin: boolean;
          fecha_nacimiento: string | null;
          pueblo_interes: string | null;
          interes_principal: string | null;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          nombre: string;
          avatar_url?: string | null;
          role?: "cliente" | "comercio" | null;
          distintivo?: boolean;
          municipio?: string | null;
          es_admin?: boolean;
          fecha_nacimiento?: string | null;
          pueblo_interes?: string | null;
          interes_principal?: string | null;
          email?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      favoritos: {
        Row: {
          id: string;
          user_id: string;
          negocio_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          negocio_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["favoritos"]["Insert"]>;
      };
    };
  };
};
