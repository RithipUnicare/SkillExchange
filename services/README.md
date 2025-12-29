# Services Documentation

This folder contains API services and configuration for the SkillExchange app.

## Files

### configuration.ts
Contains API configuration including:
- Base URL
- API endpoints
- Storage keys for AsyncStorage

**Update the BASE_URL** in this file to match your backend API URL.

### apiService.ts
Main API service class with:
- Axios instance configuration
- Request/Response interceptors
- Automatic token management
- Token refresh logic
- All authentication endpoints

## Usage

### Import the service
```typescript
import apiService from '../services/apiService';
```

### Login
```typescript
const response = await apiService.login(mobileNumber, password);
```

### Signup
```typescript
const response = await apiService.signup(name, mobileNumber, email, password);
```

### Token Storage
Tokens are automatically stored in AsyncStorage after successful login.
Access and refresh tokens are automatically managed by the API service.

### Token Refresh
The service automatically refreshes expired access tokens using the refresh token.

### Logout
```typescript
await apiService.clearTokens();
```

## Configuration

Update `API_CONFIG.BASE_URL` in `configuration.ts` with your backend URL.
