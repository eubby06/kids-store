import React from 'react';
import Wrapper from './Wrapper';

export default function TermsOfService() {
    return (
        <Wrapper>
            <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>
                <p className="mb-4 text-gray-600">
                    This is a sample terms of service. Replace with your real
                    terms.
                </p>
                <section className="prose">
                    <h2>Use of Service</h2>
                    <p>By using this site you agree to our terms.</p>
                    <h2>Limitation of Liability</h2>
                    <p>We are not liable for misuse of the site.</p>
                </section>
            </main>
        </Wrapper>
    );
}
