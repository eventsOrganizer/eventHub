export interface Review {
  id: number;
  rate: number;
  user_id: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatarUrl: string;
  };
}

export interface Like {
  id: number;
  user_id: string;
  material_id: number;
}