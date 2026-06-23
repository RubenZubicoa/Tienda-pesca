import { User } from "../../core/models/User";

export interface LoginResponse {
    token: string;
    user: User;
}