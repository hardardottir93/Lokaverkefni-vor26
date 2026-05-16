import { supabase } from "../../../lib/supabase";

export type Category = {
  id: number;
  created_at: string;
  name: string;
  slug: string;
};

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, created_at, name, slug")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
