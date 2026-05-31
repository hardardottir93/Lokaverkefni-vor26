type PaymentMeta = {
  touchedInputs: {
    cardNumber?: boolean;
    expiryDate?: boolean;
    cvc?: boolean;
  };
  erroredInputs: {
    cardNumber?: string;
    expiryDate?: string;
    cvc?: string;
  };
};

type FakePaymentSectionProps = {
  meta: PaymentMeta;
  getCardNumberProps: () => Record<string, unknown>;
  getExpiryDateProps: () => Record<string, unknown>;
  getCVCProps: () => Record<string, unknown>;
};

export function FakePaymentSection({
  meta,
  getCardNumberProps,
  getExpiryDateProps,
  getCVCProps,
}: FakePaymentSectionProps) {
  return (
    <div className="mt-8 rounded-2xl bg-stone-50 p-5">
      <h2 className="text-xl font-semibold text-stone-950">Gervigreiðsla</h2>

      <p className="mt-2 text-sm text-stone-600">
        Þessi greiðsla er aðeins til sýnis fyrir lokaverkefnið. Engar
        kortaupplýsingar eru vistaðar.
      </p>

      <div className="mt-4 grid gap-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-stone-700">
            Nafn á korti
          </span>

          <input
            className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-950"
            name="cardHolderName"
            placeholder="Prufu Notandi"
            required
            type="text"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-stone-700">Kortanúmer</span>

          <div className="flex items-center gap-3 rounded-lg border border-stone-300 bg-white px-3 py-2 focus-within:border-stone-950">
            <input
              {...getCardNumberProps()}
              className="w-full bg-transparent outline-none"
              maxLength={19}
              placeholder="4242 4242 4242 4242"
            />
          </div>

          {meta.touchedInputs.cardNumber && meta.erroredInputs.cardNumber && (
            <p className="text-sm text-red-600">
              {meta.erroredInputs.cardNumber}
            </p>
          )}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-stone-700">
              Gildistími
            </span>

            <input
              {...getExpiryDateProps()}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-950"
              placeholder="12/30"
            />

            {meta.touchedInputs.expiryDate && meta.erroredInputs.expiryDate && (
              <p className="text-sm text-red-600">
                {meta.erroredInputs.expiryDate}
              </p>
            )}
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-stone-700">CVC</span>

            <input
              {...getCVCProps()}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-950"
              maxLength={3}
              placeholder="123"
            />

            {meta.touchedInputs.cvc && meta.erroredInputs.cvc && (
              <p className="text-sm text-red-600">{meta.erroredInputs.cvc}</p>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
