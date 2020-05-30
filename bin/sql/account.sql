CREATE TABLE account(
    id       SERIAL PRIMARY KEY,
    "usernameHash" CHARACTER(64),
    "passwordHash" CHARACTER(64),
    "sessionId"    CHARACTER(36)
);

-- uses 64 characters for 256 one-bit values of SHA256
-- 2^256 = 16^64
