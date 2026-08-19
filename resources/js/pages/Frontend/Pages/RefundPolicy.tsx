import React from 'react';
import Wrapper from './Wrapper';

export default function RefundPolicy() {
    return (
        <Wrapper>
            <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-3xl font-bold">Refund Policy</h1>
                <p className="mb-4 text-gray-600">
                    This is a sample refund policy. Replace with your real
                    policy text.
                </p>
                <section className="prose">
                    <h2>Returns</h2>
                    <p>
                        We accept returns within 30 days of purchase for
                        eligible items.
                    </p>
                    <h2>Refunds</h2>
                    <p>
                        Refunds will be issued to the original payment method.
                    </p>
                </section>
            </main>
        </Wrapper>
    );
}
