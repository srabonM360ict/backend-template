CREATE SCHEMA IF NOT EXISTS student;
CREATE TABLE IF NOT EXISTS student.students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES dbo.users (id),
    institute_id integer not null references institute.institutes(id),
    department_id INTEGER NOT NULL REFERENCES institute.departments (id),
    session_id INTEGER NOT NULL REFERENCES institute.session (id),
    dob_date DATE,
    dob_no VARCHAR(50),
    religion VARCHAR(255),
    gender dbo.type_gender,
    blood_group dbo.type_blood_group,
    permanent_address VARCHAR(255),
    permanent_thana VARCHAR(255),
    permanent_division VARCHAR(255),
    permanent_postal_code VARCHAR(10),
    present_address VARCHAR(255),
    present_thana VARCHAR(255),
    present_division VARCHAR(255),
    present_postal_code VARCHAR(10),
    father_name VARCHAR(255),
    father_nid_no VARCHAR(255),
    father_phone VARCHAR(255),
    mother_name VARCHAR(255),
    mother_nid_no VARCHAR(255),
    mother_phone VARCHAR(255),
    local_guardian_relation VARCHAR(255),
    local_guardian_name VARCHAR(255),
    local_guardian_nid_no VARCHAR(255),
    local_guardian_phone VARCHAR(255),
    emergency_phone_no VARCHAR(255),
    status dbo.type_user_status DEFAULT 'active',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES dbo.users (id),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE student.attendance_sessions (
    id SERIAL PRIMARY KEY,
    institute_id integer not null references institute.institutes(id),
    subject_offering_id INTEGER NOT NULL REFERENCES institute.subject_offerings(id),
    date DATE NOT NULL,
    branch_id INTEGER NOT NULL REFERENCES institute.branches(id),
    taken_by INTEGER NOT NULL REFERENCES dbo.users (id),
    is_submitted BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student.student_attendance (
    id SERIAL PRIMARY KEY,
    institute_id integer not null references institute.institutes(id),
    attendance_session_id INTEGER NOT NULL REFERENCES student.attendance_sessions(id),
    enrollment_id INTEGER NOT NULL REFERENCES institute.enrollments(id),
    status dbo.type_attendance_status DEFAULT 'present',
    created_at TIMESTAMP DEFAULT NOW()
);




CREATE OR REPLACE VIEW student.vw_student_auth AS
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
JOIN student.students iu ON u.id = iu.user_id
WHERE u.is_deleted = FALSE AND u.user_type = 'student';