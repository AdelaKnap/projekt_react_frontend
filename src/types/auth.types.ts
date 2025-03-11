// Interface för user
export interface User {
    _id: string;  
    id?: string,
    username: string,
    password: string
}

// Interface för inloggningsuppgifter
export interface LoginCredentials {
    username: string,
    password: string
}

// Interface för responsen från lyckad autentisering/inloggning
export interface AuthResponse {
    user: User,
    token: string
}

// Interface för AuthContexten
export interface AuthContextType {
    user: User | null,
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}