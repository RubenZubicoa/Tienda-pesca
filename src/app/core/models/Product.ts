import { Brand, BrandDB } from "./Brand";
import { Category, CategoryDB } from "./Category";


type ProductOption = {
    label: string;
    options: {
        id: string;
        label: string;
    }[];
};

export type ProductDB = {
    _id: string;
    brandId: BrandDB['_id'];
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: CategoryDB['_id'];
    images: string[];
    options?: ProductOption;
    isFeatured?:boolean;
    isInOffer?: boolean;
    offerPrice?: number;
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}

export interface Product {
    uuid: string;
    brandId: Brand['uuid'];
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: Category['uuid'];
    images: string[];
    options?: ProductOption;
    isFeatured?: boolean;
    isInOffer?: boolean;
    offerPrice?: number;
}

export interface ProductCreate {
    brandId: Brand['uuid'];
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: Category['uuid'];
    images: string[];
    options?: ProductOption[];
}

export interface ProductUpdate {
    brandId?: string;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryId?: string;
    images?: string[];
    options?: ProductOption;
}

export type ProductWithQuantity = Product & {
    quantity: number;
}

export function mapProductDBToProduct(productDB: ProductDB): Product {
    return {
        uuid: productDB._id,
        brandId: productDB.brandId,
        name: productDB.name,
        description: productDB.description,
        price: productDB.price,
        stock: productDB.stock,
        categoryId: productDB.categoryId,
        images: productDB.images,
        options: productDB.options,
        isFeatured: productDB.isFeatured,
        isInOffer: productDB.isInOffer,
        offerPrice: productDB.offerPrice,
    }
}

export function isProductInOffer(product: Product): boolean {
    return Boolean(product.isInOffer && product.offerPrice != null);
}

export function getProductDisplayPrice(product: Product): number {
    return isProductInOffer(product) ? product.offerPrice! : product.price;
}