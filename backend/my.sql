CREATE TABLE slots (
    id SERIAL PRIMARY KEY,
    slot_time VARCHAR(50) NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE
);

INSERT INTO slots (slot_time) VALUES 
('09:00'),
('10:00'), 
('11:00'), 
('12:00'), 
('13:00'),
('14:00'),
('15:00'),
('16:00'),
('17:00'),

-- States and Cities Table
CREATE TABLE states_cities (
    id SERIAL PRIMARY KEY,
    state_name VARCHAR(50) NOT NULL,
    city_name VARCHAR(50) NOT NULL
);

-- Bookings Table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    state_name VARCHAR(50) NOT NULL,
    city_name VARCHAR(50) NOT NULL,
    waste_type VARCHAR(50) NOT NULL,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL
);

-- Unavailable Slots Table
CREATE TABLE unavailable_slots (
    id SERIAL PRIMARY KEY,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL
);

INSERT INTO states_cities (state_name, city_name) VALUES
('Andhra Pradesh', 'Visakhapatnam'),
('Andhra Pradesh', 'Vijayawada'),
('Andhra Pradesh', 'Guntur'),
('Maharashtra', 'Mumbai'),
('Maharashtra', 'Pune'),
('Maharashtra', 'Nagpur'),
('Tamil Nadu', 'Chennai'),
('Tamil Nadu', 'Coimbatore'),
('Tamil Nadu', 'Madurai'),
('Uttar Pradesh', 'Lucknow'),
('Uttar Pradesh', 'Kanpur'),
('Uttar Pradesh', 'Varanasi');

INSERT INTO unavailable_slots (booking_date, time_slot) VALUES
('2024-11-22', '09:00'),
('2024-11-22', '10:00');

ALTER TABLE bookings 
ALTER COLUMN name SET NOT NULL;


CREATE TABLE employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each employee
    first_name VARCHAR(50) NOT NULL,            -- Employee's first name
    last_name VARCHAR(50) NOT NULL,             -- Employee's last name
    email VARCHAR(100) UNIQUE NOT NULL,         -- Employee's email address (must be unique)
    phone_number VARCHAR(15),                   -- Employee's phone number
    hire_date DATE NOT NULL,                    -- The date the employee was hired
    job_title VARCHAR(50) NOT NULL,             -- Job title of the employee
    salary DECIMAL(10, 2) NOT NULL,             -- Employee's salary
    department_id INT,                          -- Department the employee belongs to
    manager_id INT,                             -- Manager ID (references another employee)
    is_active BOOLEAN DEFAULT TRUE,             -- Employment status (active/inactive)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Record creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Record update timestamp
    FOREIGN KEY (department_id) REFERENCES department(department_id), -- Assuming a department table exists
    FOREIGN KEY (manager_id) REFERENCES employee(employee_id) -- Self-referential foreign key for managers
);

CREATE TABLE department (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
);
