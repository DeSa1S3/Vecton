export type OrderType = 'test_drive' | 'purchase' | 'trade_in' | 'consultation';
export type OrderStatus = 'new' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'online' | 'installment' | 'credit';

export interface Order {
    id: number;
    user: number;
    user_name: string;
    car: number;
    car_info: string;
    car_image: string | null;
    assigned_to: number | null;
    assigned_to_name: string | null;
    order_type: OrderType;
    status: OrderStatus;
    total_price: number | null;
    customer_comment: string;
    manager_comment: string;
    desired_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrderDetail extends Order {
    items: OrderItem[];
    payment: Payment | null;
    review: Review | null;
}

export interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

export interface Payment {
    id: number;
    order: number;
    amount: number;
    status: PaymentStatus;
    payment_method: PaymentMethod;
    transaction_id: string;
    payment_data: Record<string, any>;
    created_at: string;
    paid_at: string | null;
}

export interface Review {
    id: number;
    user: number;
    user_name: string;
    car: number;
    car_info: string;
    rating: number;
    comment: string;
    pros: string;
    cons: string;
    is_verified: boolean;
    created_at: string;
}

export interface OrderCreateData {
    car: number;
    order_type: OrderType;
    customer_comment?: string;
    desired_date?: string | null;
}