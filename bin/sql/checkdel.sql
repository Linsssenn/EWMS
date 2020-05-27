--  Method 1: update system catalog 
UPDATE pg_database SET datallowconn = 'false' WHERE datname = 'ewmsdb';

--  Method 2: use ALTER DATABASE. Superusers still can connect! 
ALTER DATABASE ewmsdb CONNECTION LIMIT 0;

SELECT EXISTS (
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'ewmsdb'
);
