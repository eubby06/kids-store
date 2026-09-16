<?php

namespace App\Enums;

enum OrderStatus: string {
    case PENDING = 'Pending';
    case PROCESSING = 'Processing';
    case SHIPPED = 'Shipped';
    case DELIVERED = 'Delivered';
    case CANCELLED = 'Cancelled';
    case REFUNDED = 'Refunded';
    case PAID = 'Paid';
}