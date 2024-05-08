
export interface OrderItem {
    id: number;
    orderId: number;
    productVersionSizeId: number;
    quantity: number;
    price: number;
    image: string;
    style: string;
    size: string;
    productName: string;
}

export interface Order {
    id: number;
    userName: string;
    userImage: string;
    userId: number;
    status: string;
    createdAt: string;
    phoneNumber: string;
    paymentMethod: string;
    note: string;
    shippingAddress: string;
    totalAmount: number;
    items: OrderItem[];
}