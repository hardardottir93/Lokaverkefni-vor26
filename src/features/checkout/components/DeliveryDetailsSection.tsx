import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { CheckoutFormValues } from "../model/checkoutSchema";

type DeliveryDetailsSectionProps = {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
};

export function DeliveryDetailsSection({
  register,
  errors,
}: DeliveryDetailsSectionProps) {
  return (
    <>
      <h2 className="text-xl font-semibold text-stone-950">
        Afhendingarupplýsingar
      </h2>

      <div className="mt-6 grid gap-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-stone-700">Nafn</span>
          <input
            {...register("fullName")}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-950"
            type="text"
          />
          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-stone-700">
            Heimilisfang
          </span>
          <input
            {...register("address")}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-950"
            type="text"
          />
          {errors.address && (
            <p className="text-sm text-red-600">{errors.address.message}</p>
          )}
        </label>

        <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-stone-700">
              Póstnúmer
            </span>
            <input
              {...register("postalCode")}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-950"
              inputMode="numeric"
              maxLength={3}
              type="text"
            />
            {errors.postalCode && (
              <p className="text-sm text-red-600">
                {errors.postalCode.message}
              </p>
            )}
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-stone-700">Bær</span>
            <input
              {...register("city")}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-950"
              type="text"
            />
            {errors.city && (
              <p className="text-sm text-red-600">{errors.city.message}</p>
            )}
          </label>
        </div>
      </div>
    </>
  );
}
