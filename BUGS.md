# Identified Bugs and Vulnerabilities

This document lists the bugs and vulnerabilities identified during the code review.

## Authentication and Authorization Issues

### 1. Unauthenticated Cron Job Control
- **Description:** API endpoints `src/app/api/cron/route.ts` (GET for starting, DELETE for stopping) allow control over cron jobs without any authentication.
- **Steps to Reproduce:** Send a GET or DELETE request to `/api/cron`.
- **Severity:** Critical
- **Affected Files:** `src/app/api/cron/route.ts`

### 2. Unauthenticated Job Save/Unsave & Incorrect HTTP Method
- **Description:** API endpoint `src/app/api/save-job/[id]/route.ts` allows saving/unsaving a job for any user ID specified in the query parameter, without verifying if the requester owns that user ID or is an admin. It also uses a GET request for a state-modifying operation.
- **Steps to Reproduce:** Send a GET request to `/api/save-job/<job_id>?userId=<any_user_id>`.
- **Severity:** Critical
- **Affected Files:** `src/app/api/save-job/[id]/route.ts`

### 3. Unauthenticated Bulk Data Upload & Incorrect HTTP Method
- **Description:** API endpoint `src/app/api/upload-data/route.ts` allows bulk import of job data from a hardcoded local file path without any authentication. It also uses a GET request for a state-modifying operation.
- **Steps to Reproduce:** Send a GET request to `/api/upload-data`. (Requires the hardcoded file `E:\\jobs_result.json` to exist on the server).
- **Severity:** Critical
- **Affected Files:** `src/app/api/upload-data/route.ts`, `changeData.py` (related script)

### 4. Unauthenticated Resume Scoring & Resource Abuse
- **Description:** API endpoint `src/app/api/get-resume-score/route.ts` allows PDF parsing and calls to a potentially costly Generative AI API without authentication, leading to potential resource abuse (DoS, high costs).
- **Steps to Reproduce:** Send a POST request to `/api/get-resume-score` with `base64Content` (PDF) and `desc` (job description).
- **Severity:** Critical
- **Affected Files:** `src/app/api/get-resume-score/route.ts`

### 5. Unauthenticated Access to Saved Jobs
- **Description:** API endpoint `src/app/api/get-saved-jobs/[id]/route.ts` allows any user to view any other user's saved jobs by providing their user ID in the URL path, without authentication.
- **Steps to Reproduce:** Send a GET request to `/api/get-saved-jobs/<any_user_id>`.
- **Severity:** Critical
- **Affected Files:** `src/app/api/get-saved-jobs/[id]/route.ts`

### 6. Unauthenticated Access to User Profile Data
- **Description:** API endpoint `src/app/api/get-user/[id]/route.ts` allows any user to fetch profile data (excluding password, but potentially other PII) for any other user by providing their user ID in the URL path, without authentication.
- **Steps to Reproduce:** Send a GET request to `/api/get-user/<any_user_id>`.
- **Severity:** Critical
- **Affected Files:** `src/app/api/get-user/[id]/route.ts`

### 7. Unauthenticated Mass Job Date Update
- **Description:** API endpoint `src/app/api/update-date/route.ts` allows updating the `date_posted` field for all jobs in the database without any authentication. This is a highly impactful data modification.
- **Steps to Reproduce:** Send a POST request to `/api/update-date`.
- **Severity:** Critical
- **Affected Files:** `src/app/api/update-date/route.ts`

## Input Validation Issues

### 8. Weak Email Validation for Password Reset
- **Description:** The email validation in `src/app/api/auth/forgot-password/route.ts` (`!email.trim().length && !email.includes("a")`) is critically weak and can be easily bypassed or lead to errors.
- **Steps to Reproduce:** Send a POST request to `/api/auth/forgot-password` with an email that passes the weak check but is not a valid email format.
- **Severity:** High
- **Affected Files:** `src/app/api/auth/forgot-password/route.ts`

### 9. No Password Strength Validation
- **Description:** The `src/app/api/auth/update-password/route.ts` endpoint does not validate the strength (length, complexity) of the new password.
- **Steps to Reproduce:** Send a POST request to `/api/auth/update-password` (with a valid token) and a weak password.
- **Severity:** High
- **Affected Files:** `src/app/api/auth/update-password/route.ts`

## Other Security Concerns

### 10. Potential XSS via Job Search Terms
- **Description:** In `src/app/api/get-jobs/route.ts`, user-supplied search terms (e.g., `jobtitle`) are used to construct MongoDB regular expressions. If these terms are displayed verbatim on a frontend without proper sanitization/encoding, it could lead to reflected XSS.
- **Steps to Reproduce:** N/A (Depends on frontend implementation). API provides data that could be misused by a vulnerable frontend.
- **Severity:** Medium
- **Affected Files:** `src/app/api/get-jobs/route.ts` (as data source)

### 11. Temporary Storage of Hashed Password in Redis
- **Description:** During email verification (`Sign-up/route.ts` and `generateCryptotoken.tsx`), the user's hashed password is temporarily stored in Redis. While short-lived, this increases the attack surface if Redis is compromised.
- **Severity:** Low
- **Affected Files:** `src/middlewares/Auth/generateCryptotoken.tsx`, `src/app/api/auth/Sign-up/route.ts`

### 12. Insecure Data Import Process
- **Description:** The `changeData.py` script uses hardcoded local file paths and has no error handling. The `upload-data/route.ts` API endpoint consumes its output, is unauthenticated, uses GET for modification, and also uses a hardcoded path. This entire data import pipeline is insecure and fragile.
- **Severity:** High (due to the insecurity of the related API endpoint and process)
- **Affected Files:** `changeData.py`, `src/app/api/upload-data/route.ts`

### 13. Potentially Unnecessary Headers in Google Auth
- **Description:** `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` headers are set in a server-to-server fetch request to Google during Google authentication. These might be unnecessary for this context.
- **Severity:** Low
- **Affected Files:** `src/app/api/auth/[...nextauth]/route.ts`

### 14. Access Tokens and Refresh Tokens in Response Body
- **Description:** Login and token refresh endpoints return access and refresh tokens directly in the JSON response body. For web clients, storing refresh tokens in HttpOnly cookies is generally recommended for better XSS protection.
- **Severity:** Low (Common practice, but HttpOnly cookies are better for web)
- **Affected Files:** `src/app/api/auth/Login/route.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/app/api/verify/[token]/route.ts`, `src/app/api/tokens/generate-token/route.ts`

## Miscellaneous Issues

### 15. Developer Artifacts in Repository
- **Description:** The file `src/app/api/aggregation.txt` contains developer notes, sample queries, and old code. Such files should typically be excluded from production deployments.
- **Severity:** Low (Informational)
- **Affected Files:** `src/app/api/aggregation.txt`

### 16. Minor Race Condition in Cron Initialization
- **Description:** The `cronInitialized` flag in `src/app/api/cron/route.ts` is not set atomically, which could (in theory, if requests are highly concurrent) lead to `initCronJobs()` being called multiple times. The `isJobRunning` flag within `updateJobDates.ts` mitigates the impact for that specific job.
- **Severity:** Low
- **Affected Files:** `src/app/api/cron/route.ts`

### 17. Sign-up User Creation Commented Out (Clarification Needed)
- **Description:** In `src/app/api/auth/Sign-up/route.ts`, the direct database insertion of a user is commented out, relying on the email verification flow (`verify/[token]/route.ts` using `verifyAndConsumeToken`) to create the user. This is a valid pattern (verify email before creating user) but was noted as "Potential Issue" if the verification step was flawed. The verification step does create the user. This is more of an observation of the flow.
- **Severity:** Low (Informational - flow seems okay but was initially flagged for verification)
- **Affected Files:** `src/app/api/auth/Sign-up/route.ts`, `src/middlewares/Auth/generateCryptotoken.tsx`

### 18. Error Handling Consistency
- **Description:** Status codes could be more consistent (e.g., `get-user` returning 401 for a missing ID, where 400 might be more standard).
- **Severity:** Low
- **Affected Files:** e.g., `src/app/api/get-user/[id]/route.ts`

### 19. Potential ReDoS with Complex Search Regex
- **Description:** In `get-jobs/route.ts`, if users can provide extremely complex regex for job title searches, it could lead to ReDoS on the MongoDB server.
- **Severity:** Low (Depends on MongoDB's regex engine robustness and input validation)
- **Affected Files:** `src/app/api/get-jobs/route.ts`

---
**Note:** Severity levels are estimates. Critical issues should be addressed urgently.
The most pressing overall concern is the lack of authentication and authorization on many sensitive API endpoints.
