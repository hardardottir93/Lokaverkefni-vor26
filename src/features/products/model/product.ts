export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type Product = {
  id: number;
  created_at: string;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string | null;
  stock: number;
  categories: Category;
  product_variants?: ProductVariant[];
};

export type ProductVariant = {
  id: string;
  product_id: string | number;
  name: string;
  option_type: "color" | "size" | "color_size";
  color_name: string | null;
  size: string | null;
  sku: string | null;
  stock: number;
  price: number | null;
  created_at: string;
  image_url: string | null;
};
