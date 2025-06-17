
export interface ProductDetail {
  id: string;
  title: string;
  price: number;
  status: string;
  design_id: string;
  designs: {
    file_url: string;
    title: string;
    user_id: string;
    profiles: {
      first_name: string;
      last_name: string;
      age_bracket: string;
    };
  };
}
