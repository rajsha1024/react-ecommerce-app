import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearCart } from '../store/cartSlice';

export default function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(clearCart());
    setIsOrderPlaced(true);
  };

  if (isOrderPlaced) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-emerald-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
            ✓
          </div>

          <h1 className="mt-5 text-2xl font-bold text-emerald-600">
            Order placed successfully
          </h1>

          <p className="mt-3 text-slate-600">
            Thank you for your purchase.
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-7 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-slate-500">
            Add some products before going to checkout.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-indigo-600">Secure checkout</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Complete your details to place your order.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="text-lg font-bold text-slate-900">
            Shipping Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Shipping address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                placeholder="Street address"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                placeholder="Your city"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="zip"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Postal code
              </label>
              <input
                id="zip"
                name="zip"
                type="text"
                required
                placeholder="Postal code"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:bg-indigo-800"
          >
            Place Order
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Order Summary
          </h2>

          <div className="mt-5 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 border-b border-slate-100 pb-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-16 w-16 rounded-lg border border-slate-100 object-contain p-1"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-medium text-slate-700">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="text-sm font-semibold text-slate-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}