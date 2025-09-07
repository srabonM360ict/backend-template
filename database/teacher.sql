create SCHEMA IF NOT EXISTS teacher;

DROP TABLE teacher.teachers;
CREATE TABLE IF NOT EXISTS teacher.teachers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES dbo.users (id),
    institute_id integer not null references institute.institutes(id),
    department_id INTEGER REFERENCES institute.departments (id),
    dob_no VARCHAR(20),
    dob_date date,
    religion VARCHAR(50),
    status dbo.type_user_status DEFAULT 'active',
    gender dbo.type_gender,
    present_address TEXT,
    permanent_address TEXT,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    blood_group dbo.type_blood_group,
    emergency_phone_no VARCHAR(20),
    is_main BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    created_at TIMESTAMP DEFAULT NOW()
);


-- CREATE TABLE IF NOT EXISTS teacher.roles (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     description TEXT,
--     created_by INTEGER NOT NULL REFERENCES teacher.users (id),
--     created_at TIMESTAMP DEFAULT NOW(),
--     updated_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS teacher.permissions (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     read BOOLEAN DEFAULT FALSE,
--     write BOOLEAN DEFAULT FALSE,
--     update BOOLEAN DEFAULT FALSE,
--     delete BOOLEAN DEFAULT FALSE,
--     created_by INTEGER NOT NULL REFERENCES teacher.users (id),
--     created_at TIMESTAMP DEFAULT NOW(),
--     updated_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS teacher.role_permissions (
--     role_id INTEGER NOT NULL REFERENCES teacher.roles (id),
--     permission_id INTEGER NOT NULL REFERENCES teacher.permissions (id),
--     created_at TIMESTAMP DEFAULT NOW(),
--     updated_at TIMESTAMP DEFAULT NOW(),
--     PRIMARY KEY (role_id, permission_id)
-- );


CREATE TABLE teacher.student_grades (
    id SERIAL PRIMARY KEY,
    institute_id integer not null references institute.institutes(id),
    department_id INTEGER NOT NULL REFERENCES department.departments (id),
    student_id INTEGER NOT NULL REFERENCES department.students (student_id),
    teacher_id INTEGER NOT NULL REFERENCES dbo.users (id),
    subject_id INTEGER NOT NULL REFERENCES department.subjects (id),
    class_test_id INTEGER REFERENCES department.class_tests (id),
    marks_obtained NUMERIC(5, 2),
    grade VARCHAR(5),
    remarks TEXT,
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    updated_by INTEGER REFERENCES dbo.users (id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE teacher.teacher_attendance (
    id SERIAL PRIMARY KEY,
    institute_id integer not null references institute.institutes(id),
    department_id INTEGER NOT NULL REFERENCES department.departments (id),
    semester_id INTEGER NOT NULL REFERENCES institute.semesters (id),
    teacher_id INTEGER NOT NULL REFERENCES dbo.users (id),
    subject_id INTEGER NOT NULL REFERENCES institutes.subjects (id),
    date DATE NOT NULL,
    status dbo.type_attendance_status DEFAULT 'present',
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE institutes.teacher_feedback (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL REFERENCES dbo.users (id),
    student_id INTEGER REFERENCES department.students (student_id),
    institute_id integer not null references institute.institutes(id),
    department_id INTEGER NOT NULL REFERENCES department.departments (id),
    feedback_type VARCHAR(50) NOT NULL DEFAULT 'academic', -- academic / behavior / other
    message TEXT NOT NULL,
    addressed_to VARCHAR(50) NOT NULL DEFAULT 'department_head', -- department_head / principal
    status VARCHAR(20) DEFAULT 'pending', -- pending / reviewed / closed
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    updated_by INTEGER REFERENCES dbo.users (id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


CREATE OR REPLACE VIEW teacher.vw_teacher_auth AS
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
    iu.status,
    iu.institute_id
FROM dbo."users" u
JOIN teacher.teachers iu ON u.id = iu.user_id
WHERE u.is_deleted = FALSE AND u.user_type = 'teacher';