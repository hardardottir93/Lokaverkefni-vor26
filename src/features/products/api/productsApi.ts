import { supabase } from "../../../lib/supabase";
import type { Product } from "../model/product";

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  let query = supabase
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
      categories!inner (
        id,
        name,
        slug
      ),
      product_variants (
        id,
        product_id,
        name,
        option_type,
        color_name,
        size,
        sku,
        stock,
        price,
        image_url,
        created_at
      )
    `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  const { data, error } = await query;

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
        name,
        slug
      ),
        product_variants (
        id,
        product_id,
        name,
        option_type,
        color_name,
        size,
        sku,
        stock,
        price,
        image_url,
        created_at
      )
    `,
    )
    .eq("id", id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("GET PRODUCT ERROR", error);
    throw error;
  }

  return data;
}
