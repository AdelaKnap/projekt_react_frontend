export interface User {
    _id: string;  
    id?: string,
    email: string,
    username: string,
    password: string
}

export interface LoginCredentials {
    username: string,
    password: string
}

export interface AuthResponse {
    user: User,
    token: string
}

export interface AuthContextType {
    user: User | null,
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}