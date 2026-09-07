// 1. Define the possible statuses exactly as they are in Laravel
export type OrderStatus =
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

// 2. Define the structural anatomy of an Order
export interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: number; // Stored as decimal or cents
}

export interface Order {
    id: number;
    user_id: number | null; // Nullable for guest checkouts!
    customer_name: string;
    customer_email: string;
    total_amount: number;
    status: OrderStatus; // Uses our strict status type above
    items: OrderItem[]; // Nested array of items purchased
    created_at: string; // Dates come across as strings via JSON
}
