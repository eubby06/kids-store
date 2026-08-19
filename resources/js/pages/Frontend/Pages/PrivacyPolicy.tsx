import React from 'react';
import Wrapper from './Wrapper';

export default function PrivacyPolicy() {
    return (
        <Wrapper>
            <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
                <p className="mb-4 text-gray-600">
                    This is a sample privacy policy. Replace with your real
                    policy text.
                </p>
                <section className="prose">
                    <h2>Information we collect</h2>
                    <p>
                        We collect information to provide better services to our
                        users.
                    </p>
                    <h2>How we use information</h2>
                    <p>
                        We use the data to process orders and improve the site.
                    </p>
                </section>
            </main>
        </Wrapper>
    );
}
