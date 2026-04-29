export type CategoryDB = {
    _id: string;
    name: string;
    description?: string;
    parentId?: string;
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}

export interface Category {
    uuid: string;
    name: string;
    description?: string;
    parentId?: string;
}

export interface CategoryUpdate {
    name?: string;
    description?: string;
    parentId?: string;
}

export function mapCategoryDBToCategory(categoryDB: CategoryDB): Category {
    return {
        uuid: categoryDB._id,
        name: categoryDB.name,
        description: categoryDB.description,
    }
}