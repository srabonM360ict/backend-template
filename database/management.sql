CREATE SCHEMA IF NOT EXISTS management;

CREATE TABLE IF NOT EXISTS management.admin_users (
    user_id INTEGER NOT NULL REFERENCES dbo.users (id),
    status dbo.type_user_status DEFAULT 'active',
    is_main BOOLEAN DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    created_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE IF NOT EXISTS management.audit_logs (
    id SERIAL PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    details TEXT,
    payload JSONB,
    type dbo.audit_log_types NOT NULL,
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    created_at TIMESTAMP DEFAULT NOW()
);



CREATE OR REPLACE VIEW management.vw_management_auth AS
SELECT
    u.id AS user_id,
    u.login_id,
    u.email,
    u.password_hash,
    u.name,
    u.photo,
    u.phone,
    u.user_type,
    u.is_2fa_on,
    au.status
FROM dbo."users" u
JOIN management.admin_users au ON u.id = au.user_id
WHERE u.is_deleted = FALSE AND u.user_type = 'management';