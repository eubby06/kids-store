import React, { useState } from 'react';
import { useCart } from './CartContext';
import Wrapper from './Wrapper';

export default function CartPage() {
    return (
        <Wrapper>
            <CartPageContent />
        </Wrapper>
    );
}

function CartPageContent() {
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const subtotal = cartTotal;
    const shipping = subtotal > 75 || subtotal === 0 ? 0 : 5.99;
    const estimatedTax = subtotal * 0.08; // 8% flat tax example
    const total = subtotal - discount + shipping + estimatedTax;

    const handleApplyPromo = (e: React.FormEvent) => {
        e.preventDefault();
        if (promoCode.toUpperCase() === 'WELCOME10') {
            setDiscount(10);
            alert('Promo code applied: $10.00 off!');
        } else {
            alert('Invalid promo code');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
            {/* Header / Navigation */}
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
                    <div className="text-xl font-bold tracking-tight">
                        THREAD&CO
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                        Shopping Cart {cartTotal}
                    </div>
                </div>
            </header>

            {/* Main Layout Container */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold tracking-tight">
                    Your Shopping Cart
                </h1>

                {cart.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 py-24 text-center shadow-sm">
                        <svg
                            className="mx-auto mb-4 h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        <p className="mb-2 text-lg font-medium text-gray-900">
                            Your cart is empty
                        </p>
                        <p className="mb-6 text-gray-500">
                            Looks like you haven't added anything to your cart
                            yet.
                        </p>
                        <a
                            href="#shop"
                            className="inline-flex justify-center rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                        >
                            Continue Shopping
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
                        {/* Left Column: Cart Items List (8 Columns) */}
                        <section className="space-y-4 lg:col-span-7">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <ul className="divide-y divide-gray-200">
                                    {cart && cart.length > 0
                                        ? cart.map((item) => (
                                              <li
                                                  key={item.id}
                                                  className="flex py-6 first:pt-0 last:pb-0"
                                              >
                                                  {/* Product Thumbnail */}
                                                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                                                      <img
                                                          src={item.image}
                                                          alt={item.name}
                                                          className="h-full w-full object-cover object-center"
                                                      />
                                                  </div>

                                                  {/* Product Details Panel */}
                                                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                                      <div className="flex justify-between justify-items-start">
                                                          <div>
                                                              <h3 className="text-base font-semibold text-gray-900 transition-colors hover:text-black">
                                                                  <a
                                                                      href={`/products/${item.id}`}
                                                                  >
                                                                      {
                                                                          item.name
                                                                      }
                                                                  </a>
                                                              </h3>
                                                              <p className="mt-1 text-sm text-gray-500">
                                                                  {
                                                                      item.description
                                                                  }
                                                              </p>
                                                          </div>
                                                          <p className="ml-4 text-base font-semibold text-gray-900">
                                                              $
                                                              {(
                                                                  item.price *
                                                                  item.quantity
                                                              ).toFixed(2)}
                                                          </p>
                                                      </div>

                                                      {/* Interactive Quantity Control Bar */}
                                                      <div className="flex items-center justify-between pt-4">
                                                          <div className="flex items-center rounded-lg border border-gray-300 bg-gray-50">
                                                              <button
                                                                  onClick={() =>
                                                                      updateQuantity(
                                                                          item.id,
                                                                          -1,
                                                                      )
                                                                  }
                                                                  className="px-3 py-1 font-medium text-gray-600 transition-colors hover:text-black"
                                                                  aria-label="Decrease quantity"
                                                              >
                                                                  &minus;
                                                              </button>
                                                              <span className="w-6 px-2 text-center text-sm font-semibold text-gray-900 select-none">
                                                                  {
                                                                      item.quantity
                                                                  }
                                                              </span>
                                                              <button
                                                                  onClick={() =>
                                                                      updateQuantity(
                                                                          item.id,
                                                                          1,
                                                                      )
                                                                  }
                                                                  className="px-3 py-1 font-medium text-gray-600 transition-colors hover:text-black"
                                                                  aria-label="Increase quantity"
                                                              >
                                                                  &#43;
                                                              </button>
                                                          </div>

                                                          <button
                                                              onClick={() =>
                                                                  removeFromCart(
                                                                      item.id,
                                                                  )
                                                              }
                                                              className="flex items-center text-sm font-medium text-red-600 transition-colors hover:text-red-500"
                                                          >
                                                              <svg
                                                                  className="mr-1 h-4 w-4"
                                                                  fill="none"
                                                                  stroke="currentColor"
                                                                  viewBox="0 0 24 24"
                                                              >
                                                                  <path
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      strokeWidth="2"
                                                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                  />
                                                              </svg>
                                                              Remove
                                                          </button>
                                                      </div>
                                                  </div>
                                              </li>
                                          ))
                                        : null}
                                </ul>
                            </div>
                        </section>

                        {/* Right Column: Order Summary Card (5 Columns) */}
                        <aside className="space-y-4 lg:col-span-5">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="mb-6 text-lg font-semibold text-gray-900">
                                    Order Summary
                                </h2>

                                {/* Cost Calculations Pricing Table */}
                                <div className="space-y-4 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">
                                            ${subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-emerald-600">
                                            <span>Discount (WELCOME10)</span>
                                            <span>-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="font-medium text-gray-900">
                                            {shipping === 0
                                                ? 'Free'
                                                : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimated Tax</span>
                                        <span className="font-medium text-gray-900">
                                            ${estimatedTax.toFixed(2)}
                                        </span>
                                    </div>
                                    <hr className="my-4 border-gray-200" />
                                    <div className="flex justify-between text-base font-bold text-gray-900">
                                        <span>Order Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Promo Code Input Field */}
                                <form
                                    onSubmit={handleApplyPromo}
                                    className="mt-6 flex space-x-2"
                                >
                                    <input
                                        type="text"
                                        placeholder="Promo code"
                                        value={promoCode}
                                        onChange={(e) =>
                                            setPromoCode(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200"
                                    >
                                        Apply
                                    </button>
                                </form>

                                {/* Checkout Button */}
                                <button className="mt-6 w-full rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none">
                                    Proceed to Checkout
                                </button>
                            </div>
                            {/* Security trust badge info */}
                            <p className="text-center text-xs text-gray-500">
                                🔒 Secure 256-bit SSL encrypted transaction
                                verification.
                            </p>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
}
