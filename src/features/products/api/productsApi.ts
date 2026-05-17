import { supabase } from "../../../lib/supabase";
import type { Product } from "../model/product";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      created_at,
      name,
      description,
      price,
      category_id,
      image_url,
      stock,
      categories (
        id,
        name,
        slug
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as unknown as Product[];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (
        id,
        name
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
