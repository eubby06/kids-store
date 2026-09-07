import React, { useState } from 'react';
import { useCart } from './CartContext';
import Wrapper from './Wrapper';
import { router } from '@inertiajs/react';

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

    const handleProceedCheckout = () => {
        const localCart = localStorage.getItem('react_ts_cart');

        if (!localCart) {
            alert('cart is empty');
            return;
        }

        router.post('checkout/initialize', {
            cart: JSON.parse(localCart),
        });
    };

    return (
        <div className="min-h-screen bg-neutral-950 font-sans text-white antialiased">
            {/* Main Layout Container */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-extrabold tracking-tight uppercase">
                    Your Shopping Cart
                </h1>

                {cart.length === 0 ? (
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 py-24 text-center shadow-sm">
                        <svg
                            className="mx-auto mb-4 h-12 w-12 text-neutral-600"
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
                        <p className="mb-2 text-lg font-medium text-white">
                            Your cart is empty
                        </p>
                        <p className="mb-6 text-neutral-500">
                            Looks like you haven't added anything to your cart
                            yet.
                        </p>
                        <a
                            href="#shop"
                            className="inline-flex justify-center rounded-xl bg-lime-400 px-6 py-3 text-sm font-bold text-black uppercase transition-colors hover:bg-lime-300"
                        >
                            Continue Shopping
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
                        {/* Left Column: Cart Items List (8 Columns) */}
                        <section className="space-y-4 lg:col-span-7">
                            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm">
                                <ul className="divide-y divide-neutral-800">
                                    {cart && cart.length > 0
                                        ? cart.map((item) => (
                                              <li
                                                  key={`${item.id}-${item.variantId ?? 'default'}`}
                                                  className="flex py-6 first:pt-0 last:pb-0"
                                              >
                                                  {/* Product Thumbnail */}
                                                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-800">
                                                      <img
                                                          src={`/storage/${item.variantImage ?? item.images?.[0]}`}
                                                          alt={item.name}
                                                          className="h-full w-full object-cover object-center"
                                                      />
                                                  </div>

                                                  {/* Product Details Panel */}
                                                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                                      <div className="flex justify-between justify-items-start">
                                                          <div>
                                                              <h3 className="text-base font-semibold text-white transition-colors hover:text-lime-400">
                                                                  <a
                                                                      href={`/products/${item.id}`}
                                                                  >
                                                                      {
                                                                          item.name
                                                                      }
                                                                  </a>
                                                              </h3>
                                                              <p className="mt-1 text-sm text-neutral-500">
                                                                  {
                                                                      item.description
                                                                  }
                                                              </p>
                                                              {(item.variantColor ||
                                                                  item.variantSize) && (
                                                                  <p className="mt-1 text-xs text-neutral-500">
                                                                      {[
                                                                          item.variantColor &&
                                                                              `Color: ${item.variantColor}`,
                                                                          item.variantSize &&
                                                                              `Size: ${item.variantSize}`,
                                                                      ]
                                                                          .filter(
                                                                              Boolean,
                                                                          )
                                                                          .join(
                                                                              ' · ',
                                                                          )}
                                                                  </p>
                                                              )}
                                                          </div>
                                                          <p className="ml-4 text-base font-semibold text-white">
                                                              $
                                                              {(
                                                                  item.price *
                                                                  item.quantity
                                                              ).toFixed(2)}
                                                          </p>
                                                      </div>

                                                      {/* Interactive Quantity Control Bar */}
                                                      <div className="flex items-center justify-between pt-4">
                                                          <div className="flex items-center rounded-lg border border-neutral-700 bg-neutral-800">
                                                              <button
                                                                  onClick={() =>
                                                                      updateQuantity(
                                                                          item.id,
                                                                          -1,
                                                                          item.variantId,
                                                                      )
                                                                  }
                                                                  className="px-3 py-1 font-medium text-neutral-300 transition-colors hover:text-lime-400"
                                                                  aria-label="Decrease quantity"
                                                              >
                                                                  &minus;
                                                              </button>
                                                              <span className="w-6 px-2 text-center text-sm font-semibold text-white select-none">
                                                                  {
                                                                      item.quantity
                                                                  }
                                                              </span>
                                                              <button
                                                                  onClick={() =>
                                                                      updateQuantity(
                                                                          item.id,
                                                                          1,
                                                                          item.variantId,
                                                                      )
                                                                  }
                                                                  className="px-3 py-1 font-medium text-neutral-300 transition-colors hover:text-lime-400"
                                                                  aria-label="Increase quantity"
                                                              >
                                                                  &#43;
                                                              </button>
                                                          </div>

                                                          <button
                                                              onClick={() =>
                                                                  removeFromCart(
                                                                      item.id,
                                                                      item.variantId,
                                                                  )
                                                              }
                                                              className="flex items-center text-sm font-medium text-red-400 transition-colors hover:text-red-300"
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
                            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm">
                                <h2 className="mb-6 text-lg font-semibold text-white uppercase">
                                    Order Summary
                                </h2>

                                {/* Cost Calculations Pricing Table */}
                                <div className="space-y-4 text-sm text-neutral-400">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-white">
                                            ${subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-lime-400">
                                            <span>Discount (WELCOME10)</span>
                                            <span>-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="font-medium text-white">
                                            {shipping === 0
                                                ? 'Free'
                                                : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimated Tax</span>
                                        <span className="font-medium text-white">
                                            ${estimatedTax.toFixed(2)}
                                        </span>
                                    </div>
                                    <hr className="my-4 border-neutral-800" />
                                    <div className="flex justify-between text-base font-bold text-white">
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
                                        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white placeholder-neutral-500 focus:border-transparent focus:ring-1 focus:ring-lime-400 focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
                                    >
                                        Apply
                                    </button>
                                </form>

                                {/* Checkout Button */}
                                <button
                                    onClick={handleProceedCheckout}
                                    className="mt-6 flex w-full items-center justify-center rounded-xl bg-lime-400 px-6 py-3 text-sm font-bold text-black uppercase transition-colors hover:bg-lime-300 focus:outline-none"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                            {/* Security trust badge info */}
                            <p className="text-center text-xs text-neutral-500">
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
