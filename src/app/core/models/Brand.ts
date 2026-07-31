export interface BrandDB{
    _id: string;
    name: string;
    logo?: string;
    description?: string;
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}

export interface Brand {
    uuid: string;
    name: string;
    logo?: string;
    description?: string;
}

export interface BrandCreate {
    name: string;
    logo?: string;
    description?: string;
}

export interface BrandUpdate {
    name?: string;
    logo?: string;
    description?: string;
}

export function mapBrandDBToBrand(brandDB: BrandDB | Brand): Brand {
    const uuid = 'uuid' in brandDB && brandDB.uuid ? brandDB.uuid : (brandDB as BrandDB)._id;

    return {
        uuid,
        name: brandDB.name,
        logo: brandDB.logo,
        description: brandDB.description,
    };
}