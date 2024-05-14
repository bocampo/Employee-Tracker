INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Jill', 'Limpert', 5, 2),
    ('Jean', 'Husk', 4, null);

INSERT INTO roles (title, salary, department_id)
VALUES
    ('CEO', 500000, 1),
    ('Receptionist', 80000, 2),
    ('Supervisor', 110000, 3),
    ('Manager', 70000, 4),
    ('CSR', 45000, 5);

INSERT INTO departments (name)
VALUES
    ('Corporate'),
    ('Human Resources'),
    ('Management'),
    ('Team Leads'),
    ('CSR');