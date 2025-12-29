export const API_CONFIG = {
    BASE_URL: 'https://app.undefineddevelopers.online/skillexchange/api',
    TIMEOUT: 30000,
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            SIGNUP: '/auth/signup',
            REFRESH: '/auth/refresh',
            RESET_PASSWORD: '/auth/reset-password',
            REQUEST_PASSWORD_RESET: '/auth/request-password-reset',
            UPDATE_ROLE: '/auth/update-role',
        },
        USERS: {
            ME: '/users/me',
            UPDATE_ME: '/users/me',
        },
        SKILLS: {
            GET_ALL: '/skills',
            CREATE: '/skills',
            ADD_TO_ME: '/skills/me',
            REMOVE_FROM_ME: '/skills/me',
            ASSIGN: '/skills/assign',
        },
        PROFILES: {
            CREATE: '/profiles',
            UPLOAD_PHOTO: '/profiles/photo',
            GET_BY_ID: '/profiles',
            ME: '/profiles/me',
        },
        SEARCH: {
            USERS: '/search/users',
            USERS_OLD: '/search/usersold',
        },
    },
};

export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_DATA: 'userData',
};
