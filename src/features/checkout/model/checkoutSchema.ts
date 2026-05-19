import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Nafn þarf að vera að minnsta kosti 2 stafir."),

  address: z
    .string()
    .trim()
    .min(5, "Heimilisfang þarf að vera að minnsta kosti 5 stafir."),

  postalCode: z
    .string()
    .trim()
    .regex(/^\d{3}$/, "Póstnúmer þarf að vera 3 tölustafir."),

  city: z
    .string()
    .trim()
    .min(2, "Bær þarf að vera fylltur út.")
    .regex(/^[A-Za-zÁÉÍÓÚÝÞÆÖáéíóúýþæö\s-]+$/, "Bær má ekki innihalda tölur."),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
