export type CategoryDB = {
    _id: string;
    label: string;
    description?: string;
    children?: CategoryDB[];
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}

export interface Category {
    _id: string;
    label: string;
    description?: string;
    children?: Category[];
}

export interface CategoryCreate {
    label: string;
    description?: string;
    children?: Category[];
}

export interface CategoryUpdate {
    label?: string;
    description?: string;
    children?: Category[];
}