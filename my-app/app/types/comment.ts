export interface Comment {
  id: number;
  details: string;
  created_at: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatarUrl: string;
  };
}