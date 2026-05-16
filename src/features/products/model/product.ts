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
};
