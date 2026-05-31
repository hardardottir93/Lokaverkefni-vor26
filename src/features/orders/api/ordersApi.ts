import type { User } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabase";
import { getCartItemsForUser } from "../../cart/api/cartApi";
import { getOrCreateCustomer } from "../../customers/api/customersApi";
import { getShopBySlug } from "../../shops/api/shopsApi";
import { getOrCreateActiveCart } from "../../cart/api/cartSyncApi";

export async function createOrderForUser(user: User) {
  if (!user.email) {
    throw new Error("Notandi þarf að vera með netfang.");
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

  const cartItems = await getCartItemsForUser(user);

  if (cartItems.length === 0) {
    throw new Error("Karfan er tóm.");
  }

  const subtotalCents = cartItems.reduce((sum, item) => {
    return sum + item.product.price_cents * item.quantity;
  }, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      shop_id: shop.id,
      customer_id: customer.id,
      subtotal_cents: subtotalCents,
      total_cents: subtotalCents,
      currency: "ISK",
      status: "submitted",
    })
    .select("*")
    .single();

  if (orderError) {
    throw orderError;
  }

  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    variant_name: item.variant?.color_name ?? item.variant?.name ?? null,
    unit_price_cents: item.product.price_cents,
    quantity: item.quantity,
    line_total_cents: item.product.price_cents * item.quantity,
  }));

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (orderItemsError) {
    throw orderItemsError;
  }

  const { error: clearCartError } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id);

  if (clearCartError) {
    throw clearCartError;
  }

  const { error: cartStatusError } = await supabase
    .from("carts")
    .update({ status: "submitted" })
    .eq("id", cart.id);

  if (cartStatusError) {
    throw cartStatusError;
  }

  return order;
}

export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      subtotal_cents,
      total_cents,
      currency,
      submitted_at,
      order_items (
        id,
        product_name,
        variant_name,
        unit_price_cents,
        quantity,
        line_total_cents
      )
    `,
    )
    .eq("id", orderId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getOrdersForUser(user: User) {
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

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      subtotal_cents,
      total_cents,
      currency,
      submitted_at,
      order_items (
        id,
        product_name,
        variant_name,
        unit_price_cents,
        quantity,
        line_total_cents
      )
    `,
    )
    .eq("shop_id", shop.id)
    .eq("customer_id", customer.id)
    .order("submitted_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
