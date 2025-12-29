export interface LoginRequest {
    mobileNumber: string;
    password: string;
}

export interface SignupRequest {
    name: string;
    mobileNumber: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export interface UpdateRoleRequest {
    mobileNumber: string;
    roles: string;
}
