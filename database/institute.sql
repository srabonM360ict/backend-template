CREATE SCHEMA IF NOT EXISTS institute;
CREATE TYPE institute.type_institute_category AS ENUM (
    'polytechnic',
    'school'
);
CREATE TYPE institute.type_institute_ownership AS ENUM (
    'public',
    'private'
);



CREATE TABLE IF NOT EXISTS institute.institutes (
    id SERIAL PRIMARY KEY,
    institution_code VARCHAR(50) UNIQUE,
    established_year SMALLINT CHECK (established_year >= 1000 AND established_year <= EXTRACT(YEAR FROM NOW()))
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    logo VARCHAR(255),
    website VARCHAR(255),
    category institute.type_institute_category NOT NULL,
    ownership institute.type_institute_ownership NOT NULL,
    address TEXT,
    postal_code VARCHAR(20),
    status BOOLEAN DEFAULT true,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Optional: Indexes for performance
CREATE INDEX idx_institute_name ON institute.institutes (name);

CREATE INDEX idx_institute_status ON institute.institutes (status);

CREATE INDEX idx_institute_code ON institute.institutes (institution_code);



CREATE TABLE IF NOT EXISTS institute.institute_users (
    user_id INTEGER NOT NULL REFERENCES dbo.users (id),
    institute_id INTEGER NOT NULL REFERENCES institute.institutes (id),
    blood_group dbo.type_blood_group NOT NULL,
    gender dbo.type_gender NOT NULL,
    status dbo.type_user_status DEFAULT 'active',
    is_main BOOLEAN DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    created_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE IF NOT EXISTS institute.audit_trail (
    id SERIAL PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    details TEXT,
    payload JSONB,
    type dbo.audit_log_types NOT NULL,
    institute_id INTEGER NOT NULL REFERENCES institute.institutes (id),
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE IF NOT EXISTS institute.departments (
    id SERIAL PRIMARY KEY,
    institute_id integer not null references institute.institutes(id),
    name VARCHAR(255) NOT NULL,
    code integer NOT NULL,
    short_name VARCHAR(3) NOT NULL,
    department_head_id INTEGER REFERENCES dbo.users (id),
    status BOOLEAN DEFAULT true,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS institute.subjects (
    id SERIAL PRIMARY KEY,
    institute_id integer not null references institute.institutes(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    status BOOLEAN DEFAULT true,
    is_common BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES dbo.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
);

CREATE UNIQUE INDEX uniq_subject_code ON institute.subjects (code, institute_id)
WHERE is_deleted = FALSE;



CREATE TABLE institute.semesters (
    id SERIAL PRIMARY KEY,
    institute_id integer not null references institute.institutes(id),
    name VARCHAR(100) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE institute.sessions(
    id SERIAL PRIMARY KEY,
    institute_id integer not null references institute.institutes(id),
    session_no VARCHAR(50) NOT NULL,
    status BOOLEAN DEFAULT true,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE institute.type_batch_status AS ENUM (
    'running',
    'completed',
    'discontinued'
);
CREATE TABLE IF NOT EXISTS institute.branches (
    id SERIAL PRIMARY KEY,
    institute_id integer not null references institute.institutes(id),
    name VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT true,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE institute.batch(
    id SERIAL not null PRIMARY KEY,
    institute_id integer not null references institute.institutes(id),
    department_id INTEGER NOT NULL REFERENCES institute.departments (id),
    session_id INTEGER NOT NULL REFERENCES institute.sessions(id),
    batch_name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status institute.type_batch_status DEFAULT 'running',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    created_at TIMESTAMP DEFAULT NOW()
);

create UNIQUE INDEX uniq_batch_active
ON institute.batch (institute_id, department_id, session_id, batch_name)
WHERE is_deleted = FALSE;

CREATE TABLE institute.batch_semesters (
    id SERIAL PRIMARY KEY,
    institute_id INTEGER NOT NULL REFERENCES institute.institutes(id),
    batch_id INTEGER NOT NULL REFERENCES institute.batch(id),
    semester_id INTEGER NOT NULL REFERENCES institute.semesters(id),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE institute.subject_offerings (
    id SERIAL PRIMARY KEY,
    institute_id INTEGER NOT NULL REFERENCES institute.institutes(id),
    batch_semester_id INTEGER NOT NULL REFERENCES institute.batch_semesters(id),
    subject_id INTEGER NOT NULL REFERENCES institute.subjects(id),
    department_id INTEGER NOT NULL REFERENCES institute.departments(id),
    teacher_id INTEGER NOT NULL REFERENCES dbo.users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES dbo.users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX uniq_subject_offerings_active
ON institute.subject_offerings (batch_semester_id, subject_id, teacher_id, institute_id, department_id)
WHERE is_deleted = FALSE;

CREATE UNIQUE INDEX uniq_subject_offerings_active
ON institute.subject_offerings (
    semester_id,
    subject_id,
    teacher_id,
    batch_id,
    institute_id,
    department_id
)
WHERE is_deleted = FALSE;



CREATE TABLE institute.enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES dbo.users(id),
    institute_id INTEGER NOT NULL REFERENCES institute.institutes(id),
    department_id INTEGER NOT NULL REFERENCES institute.departments(id),
    batch_semester_id INTEGER NOT NULL REFERENCES institute.batch_semesters(id),
    roll_no VARCHAR(50),
    branch_id INTEGER REFERENCES institute.branches(id),
    created_by INTEGER NOT NULL REFERENCES dbo.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE UNIQUE INDEX uniq_enrollment_active
ON institute.enrollments (student_id, institute_id, department_id, batch_id, semester_id, branch_id)
WHERE is_deleted = FALSE;

-- CREATE TABLE IF NOT EXISTS institute.branch_semester_batch_students (
--     id SERIAL not null PRIMARY KEY,
--     institute_id integer not null references institute.institutes(id),
--     branch_id INTEGER REFERENCES institute.branches (id),
--     roll_no VARCHAR(50),
--     student_id INTEGER NOT NULL REFERENCES dbo.users (id),
--     batch_id INTEGER NOT NULL REFERENCES institute.batch (id),
--     semester_id INTEGER NOT NULL REFERENCES institute.semesters (id),
--     department_id INTEGER NOT NULL REFERENCES institute.departments (id),
--     is_deleted BOOLEAN DEFAULT FALSE,
--     created_by INTEGER NOT NULL REFERENCES dbo.users (id),
--     created_at TIMESTAMP DEFAULT NOW()
-- );





-- CREATE TABLE institute.batch_students(
--     id SERIAL PRIMARY KEY,
--     institute_id integer not null references institute.institutes(id),
--     semester_id INTEGER NOT NULL REFERENCES institute.semesters (id),
--     batch_id INTEGER NOT NULL REFERENCES institute.batch (id),
--     student_id INTEGER NOT NULL REFERENCES dbo.users (id),
--     is_deleted BOOLEAN DEFAULT FALSE,
--     created_by INTEGER NOT NULL REFERENCES dbo.users (id),
--     created_at TIMESTAMP DEFAULT NOW()
-- );





-- CREATE TABLE institute.department_semesters (
--     id SERIAL not null PRIMARY KEY,
--     institute_id integer not null references institute.institutes(id),
--     department_id INTEGER NOT NULL REFERENCES institute.departments (id),
--     semester_id INTEGER NOT NULL REFERENCES institute.semesters (id),
--     is_deleted BOOLEAN DEFAULT FALSE,
--     created_by INTEGER NOT NULL REFERENCES dbo.users (id),
--     created_at TIMESTAMP DEFAULT NOW()
-- );






-- CREATE TABLE IF NOT EXISTS institute.student_subjects (
--     id SERIAL PRIMARY KEY,
--     student_id INTEGER NOT NULL REFERENCES dbo.users(id),
--     semester_subject_id INTEGER NOT NULL REFERENCES institute.semester_subjects(id),
--     institute_id INTEGER NOT NULL REFERENCES institute.institutes(id),
--     is_deleted BOOLEAN DEFAULT FALSE,
--     created_by INTEGER NOT NULL REFERENCES dbo.users(id),
--     created_at TIMESTAMP DEFAULT NOW()
-- );
-- CREATE UNIQUE INDEX uniq_student_subject_active
-- ON institute.student_subjects (student_id, semester_subject_id, institute_id)
-- WHERE is_deleted = FALSE;


-- CREATE TABLE IF NOT EXISTS institute.student_semesters (
--     id SERIAL PRIMARY KEY,
--     student_id INTEGER NOT NULL REFERENCES dbo.users(id),
--     semester_id INTEGER NOT NULL REFERENCES institute.semesters(id),
--     institute_id INTEGER NOT NULL REFERENCES institute.institutes(id),
--     department_id INTEGER NOT NULL REFERENCES institute.departments(id),
--     roll_no VARCHAR(50),
--     is_deleted BOOLEAN DEFAULT FALSE,
--     created_by INTEGER NOT NULL REFERENCES dbo.users(id),
--     created_at TIMESTAMP DEFAULT NOW()
-- );
-- CREATE UNIQUE INDEX uniq_student_semester_active
-- ON institute.student_semesters (student_id, semester_id, institute_id)
-- WHERE is_deleted = FALSE;



CREATE OR REPLACE VIEW institute.vw_institute_auth AS
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
    iu.status
FROM dbo."users" u
JOIN institute.institute_users iu ON u.id = iu.user_id
WHERE u.is_deleted = FALSE AND u.user_type = 'institute';