import React, { useState, useRef, useEffect, FormEvent } from 'react';

// 1. Define strict type interfaces for the conversation feed
interface Message {
    role: 'user' | 'assistant';
    text: string;
}

interface ChatbotResponse {
    reply: string;
}

export default function AiChatBot(): React.JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            text: 'Hi! I am your Peeble & Pine shopping assistant. Ask me anything about our products!',
        },
    ]);
    const [input, setInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Explicit type for HTML scrolling anchors
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Automatically scroll to the bottom of the window when a new message arrives
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleSendMessage = async (
        e: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userText: string = input;
        setInput('');

        // Add user message immediately to the UI array state
        setMessages((prev) => [...prev, { role: 'user', text: userText }]);
        setLoading(true);

        try {
            // Query the Laravel Chat Controller endpoint asynchronously with types
            const response = await fetch('/chatbot/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ message: userText }),
            });

            if (!response.ok) {
                throw new Error(`Chatbot request failed: ${response.status}`);
            }

            const data: ChatbotResponse = await response.json();

            setMessages((prev) => [
                ...prev,
                { role: 'assistant', text: data.reply },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    text: 'Sorry, I am having trouble connecting to our stock database right now. Please try again.',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed right-6 bottom-6 z-50 font-sans text-white">
            {/* Floating Toggle Button Bubble */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex transform items-center justify-center rounded-full bg-lime-400 p-4 font-bold text-black shadow-2xl transition-all duration-200 hover:scale-105 hover:bg-lime-300"
                type="button"
            >
                {isOpen ? (
                    <span className="text-xl font-bold">✕</span>
                ) : (
                    <div className="flex items-center gap-2 px-2 font-medium uppercase">
                        <span>💬</span> Ask AI Assistant
                    </div>
                )}
            </button>

            {/* Primary Chat Frame */}
            {isOpen && (
                <div className="absolute right-0 bottom-20 flex h-112 w-80 flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl transition-all duration-300 sm:w-85">
                    {/* Header Branding */}
                    <div className="flex items-center justify-between bg-black p-4 text-white shadow-md">
                        <div>
                            <h3 className="text-base leading-tight font-bold uppercase">
                                Peeble & Pine
                            </h3>
                            <p className="flex items-center gap-1 text-xs text-lime-400">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-400"></span>{' '}
                                AI Shopping Guide
                            </p>
                        </div>
                    </div>

                    {/* Chat Messages Feed Body */}
                    <div className="max-h-[340px] flex-1 space-y-3 overflow-y-auto bg-neutral-950 p-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl p-3 text-sm whitespace-pre-line shadow-sm ${
                                        msg.role === 'user'
                                            ? 'rounded-tr-none bg-lime-400 text-black'
                                            : 'rounded-tl-none border border-neutral-800 bg-neutral-900 text-neutral-200'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Thinking/Searching Context Loading state animation */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex items-center gap-2 rounded-2xl rounded-tl-none border border-neutral-800 bg-neutral-900 p-3 shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-lime-400 [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-lime-400 [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-lime-400"></span>
                                    </div>
                                    <span className="text-xs font-medium text-neutral-500">
                                        Checking catalog...
                                    </span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input Text Box Form */}
                    <form
                        onSubmit={handleSendMessage}
                        className="flex items-center gap-2 border-t border-neutral-800 bg-neutral-900 p-3"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => setInput(e.target.value)}
                            placeholder="Ask about materials, dimensions, price..."
                            className="flex-1 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-white placeholder-neutral-500 transition focus:border-transparent focus:ring-2 focus:ring-lime-400 focus:outline-none"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="rounded-xl bg-lime-400 p-2.5 text-sm font-bold text-black transition hover:bg-lime-300 disabled:opacity-50"
                            disabled={loading || !input.trim()}
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
