import type { User } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabase";
import { getOrCreateCustomer } from "../../customers/api/customersApi";
import { getShopBySlug } from "../../shops/api/shopsApi";
import { getOrCreateActiveCart } from "./cartSyncApi";

export type SupabaseCartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    price_cents: number;
    currency: string;
    stock: number;
    stock_quantity: number;
    image_url: string | null;
  };
};

export async function getCartItemsForUser(user: User) {
  if (!user.email) {
    return [];
  }

  const shop = await getShopBySlug("prjonabudin");

  const customer = await getOrCreateCustomer({
    shopId: shop.id,
    name:
      user.user_metadata.full_name ??
      user.user_metadata.name ??
      user.email ??
      "Viðskiptavinur",
    email: user.email,
  });

  const cart = await getOrCreateActiveCart({
    shopId: shop.id,
    customerId: customer.id,
  });

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      product:products (
        id,
        name,
        slug,
        description,
        price,
        price_cents,
        currency,
        stock,
        stock_quantity,
        image_url
      )
    `,
    )
    .eq("cart_id", cart.id);

  if (error) {
    throw error;
  }

  return data as unknown as SupabaseCartItem[];
}

export async function updateCartItemQuantity(params: {
  cartItemId: string;
  quantity: number;
}) {
  const { cartItemId, quantity } = params;

  if (quantity <= 0) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId);

  if (error) {
    throw error;
  }
}

export async function removeCartItem(cartItemId: string) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (error) {
    throw error;
  }
}
