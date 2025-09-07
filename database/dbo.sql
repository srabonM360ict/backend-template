CREATE DATABASE bpi_school_saas;
CREATE SCHEMA IF NOT EXISTS dbo;
CREATE TYPE dbo.type_user AS ENUM (
    'management',
    'institute',
    'student',
    'department_head',
    'teacher'
);

CREATE TYPE dbo.type_user_status AS ENUM (
'active',
'inactive',
'blocked'
);

CREATE TYPE dbo.audit_log_types AS ENUM (
    'create',
    'update',
    'delete'
);


CREATE TYPE dbo.type_gender AS ENUM (
    "পুরুষ", "মহিলা", "অন্যান্য"
);

CREATE TYPE dbo.type_blood_group AS ENUM (
    'A+',
    'A-',
    'B+',
    'B-',
    'O+',
    'O-',
    'AB+',
    'AB-'
);

CREATE TYPE dbo.type_attendance_status AS ENUM (
    'present',
    'absent',
    'late',
    'no_action',
    'leave'
);


CREATE TABLE IF NOT EXISTS dbo.users (
    id SERIAL PRIMARY KEY,
    login_id VARCHAR(255) NOT NULL,
    code varchar(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    phone VARCHAR(20),
    photo VARCHAR(255),
    user_type dbo.type_user NOT NULL,
    is_2fa_on BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    socket_id VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_login_id ON dbo.users (login_id);


DROP INDEX IF EXISTS dbo.uniq_users_login_id;
CREATE UNIQUE INDEX uniq_users_login_id
ON dbo.users (login_id, user_type)
WHERE is_deleted = FALSE;

DROP INDEX IF EXISTS dbo.uniq_users_email;
CREATE UNIQUE INDEX uniq_users_email
ON dbo.users (email, user_type,login_id)
WHERE is_deleted = FALSE;


CREATE TABLE IF NOT EXISTS dbo.mobile_token(
    user_id INTEGER NOT NULL REFERENCES dbo.users (id),
    token VARCHAR(255) NOT NULL,
    logged_in TIMESTAMP without time zone,
    PRIMARY KEY (user_id)
);


CREATE TABLE IF NOT EXISTS dbo.error_logs
(
    id serial NOT NULL,
    level character varying(20) NOT NULL,
    message text NOT NULL,
    stack_trace text,
    source character varying(20),
    institute_id integer,
    user_id integer,
    url character varying(2083),
    http_method character varying(10),
    metadata json,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT error_logs_pkey PRIMARY KEY (id),
    CONSTRAINT error_logs_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES dbo."users"(id)
);


CREATE TABLE dbo.notices (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sender_type VARCHAR(50) NOT NULL,
    sender_id INTEGER NOT NULL REFERENCES dbo.users (id),
    target_type VARCHAR(50) NOT NULL DEFAULT 'all', -- all / single
    target_id INTEGER REFERENCES dbo.users (id),
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    updated_by INTEGER REFERENCES dbo.users (id),
    status VARCHAR(20) DEFAULT 'active', -- active / archived
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dbo.notifications (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES dbo.users (id),
    scope_type VARCHAR(50) NOT NULL,
    scope_id INTEGER,
    target_role_id INTEGER REFERENCES institutes.roles (id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) DEFAULT 'general', -- general, urgent, payment_due, attendance_alert
    status VARCHAR(20) DEFAULT 'active', -- active, archived, deleted
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);