
export interface Design {
  id: string;
  title: string;
  file_url: string;
  status: string;
  created_at: string;
  user_id: string;
  design_mockups: { id: string }[];
  design_selections: { id: string }[];
  profiles: {
    first_name: string | null;
    last_name: string | null;
  };
}

export interface StatusInfo {
  icon: React.ReactNode;
  color: string;
  label: string;
  description: string;
}
