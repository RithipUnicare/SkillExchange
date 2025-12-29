import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from './configuration';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.api.interceptors.request.use(
            async (config) => {
                const token = await this.getAccessToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.api.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest: any = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const refreshToken = await this.getRefreshToken();
                        if (refreshToken) {
                            const response = await this.refreshToken(refreshToken);
                            await this.saveTokens(response.data.accessToken, response.data.refreshToken);
                            return this.api(originalRequest);
                        }
                    } catch (refreshError) {
                        await this.clearTokens();
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    async saveTokens(accessToken: string, refreshToken: string) {
        if (accessToken) await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        if (refreshToken) await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }

    async getAccessToken(): Promise<string | null> {
        return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }

    async getRefreshToken(): Promise<string | null> {
        return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    }

    async clearTokens() {
        await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }

    async login(mobileNumber: string, password: string) {
        const response = await this.api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
            mobileNumber,
            password,
        });
        if (response.data.success && response.data.data) {
            await this.saveTokens(response.data.data.accessToken, response.data.data.refreshToken);
        }
        return response.data;
    }

    async signup(name: string, mobileNumber: string, email: string, password: string) {
        const response = await this.api.post(API_CONFIG.ENDPOINTS.AUTH.SIGNUP, {
            name,
            mobileNumber,
            email,
            password,
        });
        return response.data;
    }

    async refreshToken(refreshToken: string) {
        const response = await this.api.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
            refreshToken,
        });
        return response.data;
    }

    async requestPasswordReset(data: Record<string, string>) {
        const response = await this.api.post(API_CONFIG.ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET, data);
        return response.data;
    }

    async resetPassword(data: Record<string, string>) {
        const response = await this.api.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, data);
        return response.data;
    }

    async updateRole(mobileNumber: string, roles: string) {
        const response = await this.api.post(API_CONFIG.ENDPOINTS.AUTH.UPDATE_ROLE, {
            mobileNumber,
            roles,
        });
        return response.data;
    }

    async getCurrentUser() {
        const response = await this.api.get(API_CONFIG.ENDPOINTS.USERS.ME);
        return response.data;
    }

    async updateCurrentUser(name: string, email: string) {
        const response = await this.api.put(API_CONFIG.ENDPOINTS.USERS.UPDATE_ME, {
            name,
            email,
        });
        return response.data;
    }

    async getAllSkills() {
        const response = await this.api.get(API_CONFIG.ENDPOINTS.SKILLS.GET_ALL);
        return response.data;
    }

    async createSkill(name: string) {
        const response = await this.api.post(API_CONFIG.ENDPOINTS.SKILLS.CREATE, { name });
        return response.data;
    }

    async addSkillToMe(skillId: number) {
        const response = await this.api.post(`${API_CONFIG.ENDPOINTS.SKILLS.ADD_TO_ME}/${skillId}`);
        return response.data;
    }

    async removeSkillFromMe(skillId: number) {
        const response = await this.api.delete(`${API_CONFIG.ENDPOINTS.SKILLS.REMOVE_FROM_ME}/${skillId}`);
        return response.data;
    }

    async assignSkill(userId: number, skillName: string) {
        const response = await this.api.post(API_CONFIG.ENDPOINTS.SKILLS.ASSIGN, {
            userId,
            skillName,
        });
        return response.data;
    }

    async createProfile(bio: string, collegeName: string, department: string, yearOfStudy: string, location: string) {
        const response = await this.api.post(API_CONFIG.ENDPOINTS.PROFILES.CREATE, {
            bio,
            collegeName,
            department,
            yearOfStudy,
            location,
        });
        return response.data;
    }

    async uploadProfilePhoto(file: any) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await this.api.post(API_CONFIG.ENDPOINTS.PROFILES.UPLOAD_PHOTO, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async getProfileById(userId: number) {
        const response = await this.api.get(`${API_CONFIG.ENDPOINTS.PROFILES.GET_BY_ID}/${userId}`);
        return response.data;
    }

    async getMyProfile() {
        const response = await this.api.get(API_CONFIG.ENDPOINTS.PROFILES.ME);
        return response.data;
    }

    async searchUsers(skill?: string, name?: string, page: number = 0, size: number = 10) {
        const params: any = { page, size };
        if (skill) params.skill = skill;
        if (name) params.name = name;
        const response = await this.api.get(API_CONFIG.ENDPOINTS.SEARCH.USERS, { params });
        return response.data;
    }
}

export default new ApiService();
