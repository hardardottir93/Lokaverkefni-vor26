import { supabase } from "../../../lib/supabase";

export async function getOrCreateCustomer(params: {
  shopId: string;
  name: string;
  email: string;
}) {
  const { shopId, name, email } = params;

  const { data: existingCustomer, error: fetchError } = await supabase
    .from("shop_customers")
    .select("*")
    .eq("shop_id", shopId)
    .eq("email", email)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (existingCustomer) {
    return existingCustomer;
  }

  const { data, error } = await supabase
    .from("shop_customers")
    .insert({
      shop_id: shopId,
      name,
      email,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
