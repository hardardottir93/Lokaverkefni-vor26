import type { User } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabase";
import { getOrCreateCustomer } from "../../customers/api/customersApi";
import { getShopBySlug } from "../../shops/api/shopsApi";
import type { CartItem } from "../store/cartStore";

export async function getOrCreateActiveCart(params: {
  shopId: string;
  customerId: string;
}) {
  const { shopId, customerId } = params;

  const { data: existingCarts, error: fetchError } = await supabase
    .from("carts")
    .select("*")
    .eq("shop_id", shopId)
    .eq("customer_id", customerId)
    .limit(1);

  if (fetchError) {
    throw fetchError;
  }

  const existingCart = existingCarts?.[0];

  if (existingCart) {
    if (existingCart.status === "active") {
      return existingCart;
    }

    const { data: updatedCarts, error: updateError } = await supabase
      .from("carts")
      .update({ status: "active" })
      .eq("id", existingCart.id)
      .select("*")
      .limit(1);

    if (updateError) {
      throw updateError;
    }

    const updatedCart = updatedCarts?.[0];

    if (!updatedCart) {
      throw new Error("Cart exists, but it could not be updated.");
    }

    return updatedCart;
  }

  const { data: insertedCarts, error: insertError } = await supabase
    .from("carts")
    .insert({
      shop_id: shopId,
      customer_id: customerId,
      status: "active",
    })
    .select("*")
    .limit(1);

  if (!insertError) {
    const insertedCart = insertedCarts?.[0];

    if (!insertedCart) {
      throw new Error("Cart was created but no cart was returned.");
    }

    return insertedCart;
  }

  if (insertError.code !== "23505") {
    throw insertError;
  }

  const { data: cartsAfterConflict, error: conflictFetchError } = await supabase
    .from("carts")
    .select("*")
    .eq("shop_id", shopId)
    .eq("customer_id", customerId)
    .limit(1);

  if (conflictFetchError) {
    throw conflictFetchError;
  }

  const cartAfterConflict = cartsAfterConflict?.[0];

  if (!cartAfterConflict) {
    throw new Error("Cart already exists, but it could not be found.");
  }

  if (cartAfterConflict.status === "active") {
    return cartAfterConflict;
  }

  const { data: updatedCarts, error: updateError } = await supabase
    .from("carts")
    .update({ status: "active" })
    .eq("id", cartAfterConflict.id)
    .select("*")
    .limit(1);

  if (updateError) {
    throw updateError;
  }

  const updatedCart = updatedCarts?.[0];

  if (!updatedCart) {
    throw new Error("Cart exists after conflict, but it could not be updated.");
  }

  return updatedCart;
}

export async function syncLocalCartToSupabase(params: {
  shopId: string;
  customerId: string;
  items: CartItem[];
}) {
  const { shopId, customerId, items } = params;

  if (items.length === 0) {
    return null;
  }

  const cart = await getOrCreateActiveCart({
    shopId,
    customerId,
  });

  for (const item of items) {
    let existingItemQuery = supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cart.id)
      .eq("product_id", item.product.id);

    if (item.variant?.id) {
      existingItemQuery = existingItemQuery.eq("variant_id", item.variant.id);
    } else {
      existingItemQuery = existingItemQuery.is("variant_id", null);
    }

    const { data: existingItem, error: fetchError } =
      await existingItemQuery.maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    const stock = item.variant?.stock ?? item.product.stock;

    if (stock <= 0) {
      continue;
    }

    if (existingItem) {
      const nextQuantity = Math.min(
        existingItem.quantity + item.quantity,
        stock,
      );

      const { error } = await supabase
        .from("cart_items")
        .update({
          quantity: nextQuantity,
        })
        .eq("id", existingItem.id);

      if (error) {
        throw error;
      }
    } else {
      const { error } = await supabase.from("cart_items").insert({
        cart_id: cart.id,
        product_id: item.product.id,
        variant_id: item.variant?.id ?? null,
        quantity: Math.min(item.quantity, stock),
      });

      if (error) {
        throw error;
      }
    }
  }

  return cart;
}

export async function syncUserCart(params: { user: User; items: CartItem[] }) {
  const { user, items } = params;

  if (items.length === 0 || !user.email) {
    return null;
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

  return syncLocalCartToSupabase({
    shopId: shop.id,
    customerId: customer.id,
    items,
  });
}
