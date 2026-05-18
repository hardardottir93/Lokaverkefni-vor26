import { supabase } from "../../../lib/supabase";

export async function getShopBySlug(slug: string) {
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
