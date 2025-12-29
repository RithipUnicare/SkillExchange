export interface User {
    id: number;
    name: string;
    mobileNumber: string;
    email: string;
    roles: string;
    profileImageUrl?: string;
}

export interface Profile {
    userId: number;
    name: string;
    bio?: string;
    collegeName?: string;
    department?: string;
    yearOfStudy?: string;
    location?: string;
    profileImageUrl?: string;
    skills?: string[];
}

export interface Skill {
    id: number;
    name: string;
}

export interface SearchResult {
    content: Profile[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}
