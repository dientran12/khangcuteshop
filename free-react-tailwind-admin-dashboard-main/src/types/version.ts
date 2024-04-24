export interface Size {
    size: string;
    quantity: number;
}

export interface Version {
    id: number;
    productId: number;
    style: string;
    sold: number;
    stock: number;
    images: string[];
    fileImages: File[];
    sizes: Size[];
}

