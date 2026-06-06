# Frontend Integration Guide (React)

## Base URL

Set API URL in frontend `.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:8080
```

## Auth Flow (Secure Token Strategy)

1. `POST /auth/login` with `{ username, password }`.
2. Backend returns `access_token` in JSON and sets `refresh_token` as `HttpOnly` cookie.
3. Store access token in memory (or short-lived storage) and send in `Authorization` header.
4. On `401`, call `POST /auth/refresh` (browser sends refresh cookie automatically) and retry original request.

## Error Handling Pattern

- Handle backend errors from `{ error: "message" }`.
- Redirect to `/login` if refresh fails.

## Axios Example

```js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = 'Bearer ' + accessToken;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = await api.post('/auth/refresh');
      setAccessToken(refresh.data.access_token);
      error.config.headers.Authorization = 'Bearer ' + refresh.data.access_token;
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;
```
