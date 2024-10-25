export interface Review {
  id: number;
  user_id: string;
  rate: number;
  user: {
    firstname: string;
    lastname: string;
  };
}

export interface Like {
  id: number;
  user_id: string;
  material_id: number;
}
