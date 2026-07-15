## 2026-07-14 — Refresh token errors
/refresh returns typed errors ("TokenExpiredError" - expired, "JsonWebTokenError" - invalid, "NoTokenError" - no token) 
in the response body instead of just status codes, so frontend can 
distinguish "please log in again" from other failures. All should re-prompt login


