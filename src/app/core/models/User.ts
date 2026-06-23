export type UserDB = {
    _id: string;
    name: string;
    lastName: string;
    phone: string;
    address: string;
    email: string;
    password: string;
    role: string;
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}

export interface User {
    uuid: string;
    name: string;
    lastName: string;
    phone: string;
    address: string;
    email: string;
    role: string;
}

export type AddUser = Omit<User, '_id' | 'createdAt' | 'updatedAt' | 'isDeleted'>;
export type UpdateUser = Omit<User, '_id' | 'password' | 'createdAt' | 'updatedAt' | 'isDeleted'>;

export function mapUserDBToUser(userDB: UserDB): User {
    return {
        uuid: userDB._id,
        name: userDB.name,
        lastName: userDB.lastName,
        phone: userDB.phone,
        address: userDB.address,
        email: userDB.email,
        role: userDB.role,
    }
}