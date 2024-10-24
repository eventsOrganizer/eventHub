export interface Comment {
    id: number;
    user_id: string;
    details: string;
    created_at: string;
    user: {
      firstname: string;
      lastname: string;
    };
  }