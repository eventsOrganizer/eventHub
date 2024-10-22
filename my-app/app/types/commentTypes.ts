export interface Comment {
  id: number;
  details: string;
  user_id: string;
  created_at: string;
  user: { 
    username: string;
    media: { 
      url: string;
    }[] | null;
  };
}