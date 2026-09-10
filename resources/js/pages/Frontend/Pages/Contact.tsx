import React, { useState, useEffect } from 'react';
import Wrapper from './Wrapper';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

// Coordinates for the address (e.g., Empire State Building)
const centerPosition = { lat: 40.7484, lng: -73.9857 };
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

export default function Contact() {
    return (
        <Wrapper>
            <ContactPage></ContactPage>
        </Wrapper>
    );
}

function ContactPage() {
    const { flash } = usePage<PageProps>().props;
    const [visible, setVisible] = useState(false);
    const { data, setData, post, processing, errors, resetAndClearErrors } =
        useForm({
            name: '',
            email: '',
            order_number: '',
            subject: 'general',
            message: '',
        });

    // Trigger visibility and auto-hide if a new success message arrives
    useEffect(() => {
        if (flash.success) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000); // hide after 5s
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ): void => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>): void => {
        e.preventDefault();
        post('/contact-us', {
            onSuccess: () => resetAndClearErrors(),
        });
    };

    return (
        <div className="min-h-screen bg-neutral-950 font-sans text-white antialiased">
            {/* Main Layout Container */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {visible && (
                    <div className="mb-4 rounded bg-green-100 p-4 text-green-700">
                        {flash.success}
                    </div>
                )}

                <p className="m-4 max-w-2xl text-lg text-neutral-400">
                    Have questions about an order or our products? Drop us a
                    line and our team will get back to you within 24 hours.
                </p>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Column 1 & 2: Contact Form */}
                    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-8 shadow-sm lg:col-span-2">
                        <h2 className="mb-6 text-xl font-bold text-white">
                            Send us a Message
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-1 block text-sm font-medium text-neutral-300"
                                    >
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={data.name}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2 text-white placeholder-neutral-500 transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                        placeholder="John Doe"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-1 block text-sm font-medium text-neutral-300"
                                    >
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={data.email}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2 text-white placeholder-neutral-500 transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Order Number (Optional) */}
                                <div>
                                    <label
                                        htmlFor="order_number"
                                        className="mb-1 block text-sm font-medium text-neutral-300"
                                    >
                                        Order Number{' '}
                                        <span className="text-xs text-neutral-500">
                                            (Optional)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        id="order_number"
                                        name="order_number"
                                        value={data.order_number}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2 text-white placeholder-neutral-500 transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                        placeholder="#1001"
                                    />
                                </div>

                                {/* Subject Dropdown */}
                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="mb-1 block text-sm font-medium text-neutral-300"
                                    >
                                        Inquiry Reason *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={data.subject}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2 text-white transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option
                                            value="general"
                                            className="bg-neutral-900"
                                        >
                                            General Inquiry
                                        </option>
                                        <option
                                            value="order"
                                            className="bg-neutral-900"
                                        >
                                            Order Status / Tracking
                                        </option>
                                        <option
                                            value="returns"
                                            className="bg-neutral-900"
                                        >
                                            Returns & Refunds
                                        </option>
                                        <option
                                            value="wholesale"
                                            className="bg-neutral-900"
                                        >
                                            Wholesale / Partnership
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label
                                    htmlFor="message"
                                    className="mb-1 block text-sm font-medium text-neutral-300"
                                >
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    value={data.message}
                                    onChange={handleChange}
                                    className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2 text-white placeholder-neutral-500 transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:outline-none sm:w-auto"
                                >
                                    Submit Inquiry
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Column 3: Contact Info & Google Map */}
                    <div className="space-y-6">
                        {/* Contact Details Card */}
                        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-8 shadow-sm">
                            <h2 className="mb-6 text-xl font-bold text-white">
                                Store Details
                            </h2>

                            <div className="space-y-4 text-sm text-neutral-300">
                                {/* Address */}
                                <div className="flex items-start gap-3">
                                    <span
                                        className="mt-0.5 text-xl"
                                        aria-hidden="true"
                                    >
                                        📍
                                    </span>
                                    <div>
                                        <p className="font-semibold text-white">
                                            Our Headquarters
                                        </p>
                                        <p>123 Commerce Avenue, Suite 400</p>
                                        <p>Tech City, TC 54321</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-3">
                                    <span
                                        className="text-xl"
                                        aria-hidden="true"
                                    >
                                        ✉️
                                    </span>
                                    <div>
                                        <p className="font-semibold text-white">
                                            Email Support
                                        </p>
                                        <a
                                            href="mailto:support@yourdomain.com"
                                            className="text-indigo-400 hover:underline"
                                        >
                                            support@yourdomain.com
                                        </a>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center gap-3">
                                    <span
                                        className="text-xl"
                                        aria-hidden="true"
                                    >
                                        📞
                                    </span>
                                    <div>
                                        <p className="font-semibold text-white">
                                            Call Us
                                        </p>
                                        <p>+1 (555) 019-2834</p>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex items-start gap-3 border-t border-neutral-800 pt-2">
                                    <span
                                        className="mt-0.5 text-xl"
                                        aria-hidden="true"
                                    >
                                        🕒
                                    </span>
                                    <div>
                                        <p className="font-semibold text-white">
                                            Operating Hours
                                        </p>
                                        <p>Mon - Fri: 9:00 AM - 6:00 PM EST</p>
                                        <p>Sat - Sun: Closed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-72 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 p-4 shadow-sm">
                            <div className="h-full w-full overflow-hidden rounded-lg hue-rotate-[180deg] invert-[90%]">
                                <APIProvider apiKey={apiKey}>
                                    <Map
                                        defaultCenter={centerPosition}
                                        defaultZoom={13}
                                        gestureHandling={'cooperative'}
                                        disableDefaultUI={true}
                                    >
                                        <Marker position={centerPosition} />
                                    </Map>
                                </APIProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
