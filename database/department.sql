
-- CREATE TABLE IF NOT EXISTS institute.departments (
--     id SERIAL PRIMARY KEY,
--     institute_id integer not null references institute.institutes(id),
--     name VARCHAR(255) NOT NULL,
--     department_head_id INTEGER REFERENCES dbo.users (id),
--     status BOOLEAN DEFAULT true,
--     is_deleted BOOLEAN DEFAULT FALSE,
--     created_by INTEGER NOT NULL REFERENCES dbo.users (id),
--     updated_by INTEGER REFERENCES dbo.users (id),
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS institute.subjects (
--     id SERIAL PRIMARY KEY,
--     institute_id integer not null references institute.institutes(id),
--     name VARCHAR(255) NOT NULL,
--     status BOOLEAN DEFAULT true,
--     is_deleted BOOLEAN DEFAULT FALSE,
--     created_by INTEGER NOT NULL REFERENCES dbo.users(id),
--     updated_by INTEGER REFERENCES dbo.users (id),
--     created_at TIMESTAMP DEFAULT NOW()
-- );



-- CREATE TABLE institute.semesters (
--     id SERIAL PRIMARY KEY,
--     institute_id integer not null references institute.institutes(id),
--     name VARCHAR(100) NOT NULL,
--     start_date DATE,
--     end_date DATE,
--     status BOOLEAN DEFAULT FALSE,
--     is_deleted BOOLEAN DEFAULT FALSE,
--     created_by INTEGER NOT NULL REFERENCES dbo.users (id),
--     updated_by INTEGER REFERENCES dbo.users (id),
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE institute.department_semesters(
--     id SERIAL PRIMARY KEY,
--     institute_id integer not null references institute.institutes(id),
--     department_id INTEGER NOT NULL REFERENCES institute.departments (id),
--     semester_id INTEGER NOT NULL REFERENCES institute.semesters (id),
--     created_by INTEGER NOT NULL REFERENCES dbo.users (id),
--     is_deleted BOOLEAN DEFAULT FALSE,
--     created_at TIMESTAMP DEFAULT NOW()
-- );


-- CREATE TABLE institute.department_semester_subjects(
--     id SERIAL PRIMARY KEY,
--     institute_id integer not null references institute.institutes(id),
--     department_id INTEGER NOT NULL REFERENCES institute.departments (id),
--     semester_id INTEGER NOT NULL REFERENCES institute.semesters (id),
--     subject_id INTEGER NOT NULL REFERENCES institute.subjects (id),
--     teacher_id INTEGER NOT NULL REFERENCES dbo.users (id),
--     created_by INTEGER NOT NULL REFERENCES dbo.users (id),
--     is_deleted BOOLEAN DEFAULT FALSE,
--     created_at TIMESTAMP DEFAULT NOW()
-- );



-- -- CREATE TABLE institute.assignments (
-- --     id SERIAL PRIMARY KEY,
-- --     institute_id integer not null references institute.institutes(id),
-- --     department_id INTEGER NOT NULL REFERENCES institute.departments (id),
-- --     subject_id INTEGER NOT NULL REFERENCES institute.subjects (id),
-- --     teacher_id INTEGER NOT NULL REFERENCES dbo.users (id),
-- --     title VARCHAR(255) NOT NULL,
-- --     description TEXT,
-- --     file_url TEXT,
-- --     due_date DATE,
-- --     created_at TIMESTAMP DEFAULT NOW(),
-- --     updated_at TIMESTAMP DEFAULT NOW()
-- -- );

-- -- CREATE TABLE institute.assignment_submissions (
-- --     id SERIAL PRIMARY KEY,
-- --     institute_id integer not null references institute.institutes(id),
-- --     department_id INTEGER NOT NULL REFERENCES institute.departments (id),
-- --     assignment_id INTEGER NOT NULL REFERENCES institute.assignments (id) ON DELETE CASCADE,
-- --     student_id INTEGER NOT NULL REFERENCES institute.students (id) ON DELETE CASCADE,
-- --     file_url TEXT,
-- --     submitted_at TIMESTAMP DEFAULT NOW(),
-- --     graded BOOLEAN DEFAULT FALSE,
-- --     marks NUMERIC(5, 2),
-- --     feedback TEXT
-- -- );


-- -- CREATE TABLE institute.class_tests (
-- --     id SERIAL PRIMARY KEY,
-- --     institute_id integer not null references institute.institutes(id),
-- --     department_id INTEGER NOT NULL REFERENCES institute.departments (id),
-- --     semester_id INTEGER NOT NULL REFERENCES institutes.semesters (id) ON DELETE CASCADE,
-- --     subject_id INTEGER NOT NULL REFERENCES institutes.subjects (id),
-- --     teacher_id INTEGER REFERENCES dbo.users (id),
-- --     name VARCHAR(255) NOT NULL,
-- --     date DATE,
-- --     total_marks INTEGER,
-- --     status VARCHAR(20) DEFAULT 'scheduled',
-- --     created_by INTEGER NOT NULL REFERENCES dbo.users (id),
-- --     updated_by INTEGER REFERENCES dbo.users (id),
-- --     created_at TIMESTAMP DEFAULT NOW(),
-- --     updated_at TIMESTAMP DEFAULT NOW()
-- -- );

-- -- CREATE TABLE institute.timetables (
-- --     id SERIAL PRIMARY KEY,
-- --     institute_id integer not null references institute.institutes(id),
-- --     department_id INTEGER NOT NULL REFERENCES institute.departments (id),
-- --     semester_id INTEGER NOT NULL REFERENCES institute.semesters (id),
-- --     subject_id INTEGER NOT NULL REFERENCES institute.subjects (id),
-- --     teacher_id INTEGER NOT NULL REFERENCES dbo.users (id),
-- --     day_of_week VARCHAR(20),
-- --     room_number VARCHAR(20),
-- --     start_time TIME,
-- --     end_time TIME,
-- --     status VARCHAR(20) DEFAULT 'active',
-- --     is_deleted BOOLEAN DEFAULT FALSE,
-- --     created_by INTEGER NOT NULL REFERENCES dbo.users (id),
-- --     updated_by INTEGER REFERENCES dbo.users (id),
-- --     created_at TIMESTAMP DEFAULT NOW(),
-- --     updated_at TIMESTAMP DEFAULT NOW()
-- -- );

-- -- CREATE TABLE institute.events (
-- --     id SERIAL PRIMARY KEY,
-- --     institute_id integer not null references institute.institutes(id),
-- --     department_id INTEGER NOT NULL REFERENCES institute.departments (id),
-- --     title VARCHAR(255) NOT NULL,
-- --     description TEXT,
-- --     event_type VARCHAR(50) DEFAULT 'event',
-- --     start_datetime TIMESTAMP,
-- --     end_datetime TIMESTAMP,
-- --     registration_required BOOLEAN DEFAULT FALSE,
-- --     status VARCHAR(20) DEFAULT 'upcoming',
-- --     is_deleted BOOLEAN DEFAULT FALSE,
-- --     created_by INTEGER NOT NULL REFERENCES dbo.users (id),
-- --     updated_by INTEGER REFERENCES dbo.users (id),
-- --     created_at TIMESTAMP DEFAULT NOW(),
-- --     updated_at TIMESTAMP DEFAULT NOW()
-- -- );

-- -- CREATE TABLE institutes.event_registrations (
-- --     id SERIAL PRIMARY KEY,
-- --     institute_id integer not null references institute.institutes(id),
-- --     department_id INTEGER NOT NULL REFERENCES institute.departments (id),
-- --     event_id INTEGER NOT NULL REFERENCES institutes.events (id) ON DELETE CASCADE,
-- --     student_id INTEGER NOT NULL REFERENCES institutes.students (id) ON DELETE CASCADE,
-- --     registered_at TIMESTAMP DEFAULT NOW(),
-- --     status VARCHAR(20) DEFAULT 'registered'
-- -- );

-- -- CREATE TABLE institutes.department_resources (
-- --     id SERIAL PRIMARY KEY,
-- --     institute_id integer not null references institute.institutes(id),
-- --     department_id INTEGER NOT NULL REFERENCES institute.departments (id),
-- --     subject_id INTEGER REFERENCES institutes.subjects (id),
-- --     teacher_id INTEGER REFERENCES dbo.users (id),
-- --     title VARCHAR(255) NOT NULL,
-- --     description TEXT,
-- --     file_path TEXT, -- path or URL to file
-- --     status VARCHAR(50) DEFAULT 'pending', -- approved/review/pending
-- --     is_deleted BOOLEAN DEFAULT FALSE,
-- --     created_by INTEGER NOT NULL REFERENCES dbo.users (id),
-- --     updated_by INTEGER REFERENCES dbo.users (id),
-- --     created_at TIMESTAMP DEFAULT NOW(),
-- --     updated_at TIMESTAMP DEFAULT NOW()
-- -- );

-- -- CREATE TABLE institute.department_requests (
-- --     id SERIAL PRIMARY KEY,
-- --     institute_id integer not null references institute.institutes(id),
-- --     department_id INTEGER NOT NULL REFERENCES institute.departments (id),
-- --     request_type VARCHAR(100),
-- --     description TEXT,
-- --     status VARCHAR(50) DEFAULT 'pending',
-- --     requested_by INTEGER NOT NULL REFERENCES dbo.users (id),
-- --     approved_by INTEGER REFERENCES dbo.users (id),
-- --     created_at TIMESTAMP DEFAULT NOW(),
-- --     updated_at TIMESTAMP DEFAULT NOW()
-- -- );