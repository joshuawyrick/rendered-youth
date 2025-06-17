
export interface Design {
  id: string;
  title: string;
  file_url: string;
  status: string;
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  base_price?: number;
  status: string;
  creator_commission_rate: number;
  created_at: string;
  design_id: string;
  collection_id?: string;
  assigned_user_id?: string;
  collection_name?: string;
  assigned_user_name?: string;
  designs: {
    title: string;
    file_url: string;
    profiles: {
      first_name: string;
      last_name: string;
    };
  };
}
