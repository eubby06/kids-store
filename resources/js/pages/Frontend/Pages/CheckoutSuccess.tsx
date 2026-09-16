import React from 'react';
import Wrapper from './Wrapper';

export default function CheckoutSuccess() {
    return (
        <Wrapper>
            <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-3xl font-extrabold text-white uppercase">
                    Thank you for your purchase!
                </h1>
                <p className="mb-4 text-neutral-400">
                    Please continue shopping...
                </p>
            </main>
        </Wrapper>
    );
}
