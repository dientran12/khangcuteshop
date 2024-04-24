import { Version } from "./version";

export interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  description: string;
  category: string[];
  sold: number;
  stock: number;
  images: string[];
  fileImages: File[];
  versions: Version[];
}