export interface MessageItem {
    id: number;
    email: string;
    name: string;
    order_number?: number;
    subject: string;
    message: string;
    sent: string;
    status: 'NEW' | 'REPLIED' | 'IMPORTANT';
}
