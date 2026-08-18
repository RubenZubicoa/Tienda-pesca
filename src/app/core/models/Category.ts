export type CategoryDB = {
    _id: string;
    label: string;
    description?: string;
    image?: string;
    children?: CategoryDB[];
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}

export interface Category {
    uuid: string;
    label: string;
    description?: string;
    image?: string;
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

export function mapCategoryDBToCategory(categoryDB: CategoryDB | Category): Category {
    const raw = categoryDB as CategoryDB & Category;

    return {
        uuid: raw.uuid || raw._id,
        label: raw.label,
        description: raw.description,
        image: raw.image,
        children: raw.children?.map((child) => mapCategoryDBToCategory(child as CategoryDB | Category)),
    }
}