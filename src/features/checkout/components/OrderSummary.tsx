type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
};

type OrderSummaryProps = {
  cartItems: CartItem[];
  totalQuantity: number;
  totalPrice: number;
};

export function OrderSummary({
  cartItems,
  totalQuantity,
  totalPrice,
}: OrderSummaryProps) {
  return (
    <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-950">Pöntunaryfirlit</h2>

      <div className="mt-5 space-y-4 border-b border-stone-200 pb-5">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between gap-4 text-sm">
            <div>
              <p className="font-medium text-stone-950">{item.product.name}</p>
              <p className="text-stone-500">Magn: {item.quantity}</p>
            </div>

            <p className="font-medium text-stone-950">
              {(item.product.price * item.quantity).toLocaleString("is-IS")} kr.
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex justify-between text-sm text-stone-600">
          <span>Samtals magn</span>
          <span>{totalQuantity}</span>
        </div>

        <div className="flex justify-between text-lg font-semibold text-stone-950">
          <span>Samtals</span>
          <span>{totalPrice.toLocaleString("is-IS")} kr.</span>
        </div>
      </div>
    </aside>
  );
}
