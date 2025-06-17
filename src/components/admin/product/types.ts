
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
  price: number;
  status: string;
  creator_commission_rate: number;
  created_at: string;
  design_id: string;
  designs: {
    title: string;
    file_url: string;
    profiles: {
      first_name: string;
      last_name: string;
    };
  };
}
