import { Brand, BrandDB } from "./Brand";
import { Category, CategoryDB } from "./Category";


export type ProductOptionChoice = {
    id: string;
    label: string;
    /** Imagen opcional asociada a esta opción (color, talla, etc.). */
    imageUrl?: string;
};

export type ProductOption = {
    label: string;
    options: ProductOptionChoice[];
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
    /** Vídeo explicativo opcional del producto. */
    videoUrl?: string;
    options?: ProductOption;
    isFeatured?:boolean;
    isInOffer?: boolean;
    offerPrice?: number;
    professionalPrice?: number;
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
    /** Vídeo explicativo opcional del producto. */
    videoUrl?: string;
    options?: ProductOption;
    isFeatured?: boolean;
    isInOffer?: boolean;
    offerPrice?: number;
    professionalPrice?: number;
}

export interface ProductCreate {
    brandId: Brand['uuid'];
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: Category['uuid'];
    images: string[];
    videoUrl?: string;
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
    videoUrl?: string;
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
        videoUrl: productDB.videoUrl?.trim() || undefined,
        options: mapProductOptions(productDB.options),
        isFeatured: productDB.isFeatured,
        isInOffer: productDB.isInOffer,
        offerPrice: typeof productDB.offerPrice === 'number' ? productDB.offerPrice : undefined,
        professionalPrice:
            typeof productDB.professionalPrice === 'number' ? productDB.professionalPrice : undefined,
    }
}

function mapProductOptions(options?: ProductOption | null): ProductOption | undefined {
    if (!options?.options?.length) return undefined;

    return {
        label: options.label,
        options: options.options.map((opt, index) => {
            const label = String(opt.label ?? '').trim() || `Opción ${index + 1}`;
            const id = String(opt.id ?? '').trim() || label;
            const imageUrl = opt.imageUrl?.trim() || undefined;
            return { id, label, imageUrl };
        }),
    };
}

export function isProductInOffer(product: Product): boolean {
    return (
        product.isInOffer === true &&
        typeof product.offerPrice === 'number' &&
        Number.isFinite(product.offerPrice)
    );
}

export function getProductDisplayPrice(product: Product): number {
    return isProductInOffer(product) ? product.offerPrice! : product.price;
}