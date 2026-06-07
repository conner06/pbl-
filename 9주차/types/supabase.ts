export type Database = {
  public: {
    Tables: {
      lions: {
        Row: {
          id: number;
          name: string;
          part: string;
          intro: string;
          bio: string | null;
          email: string | null;
          phone: string | null;
          website: string | null;
          skills: string[] | null;
          quote: string | null;
          badge: string | null;
          picture: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          part: string;
          intro: string;
          bio?: string | null;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          skills?: string[] | null;
          quote?: string | null;
          badge?: string | null;
          picture?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          part?: string;
          intro?: string;
          bio?: string | null;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          skills?: string[] | null;
          quote?: string | null;
          badge?: string | null;
          picture?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
