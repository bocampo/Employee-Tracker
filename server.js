//imports inquirer, pg and express
const inquirer = require('inquirer');
const { Pool } = require('pg');
const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const pool = new Pool(
    {
        user: 'postgres',
        password: 'password',
        host: 'localhost',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
)

pool.connect();

//Prompts user with options on how to use database
function menu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'userChoice',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
            },
        ]).
        then((response) => databaseAction(response));
}

function databaseAction(userQuery) {

    //Checks if user decided to view these tables
    if (userQuery.userChoice == 'View all departments' || userQuery.userChoice == 'View all roles' || userQuery.userChoice == 'View all employees') {
        //User chose to view departments table
        if (userQuery.userChoice == 'View all departments') {

            pool.query('SELECT * FROM departments', function (err, { rows }) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.table(rows);
                    menu();
                }
            });
        }
        //User chose to view roles table
        else if (userQuery.userChoice == 'View all roles') {
            pool.query('SELECT * FROM roles', function (err, { rows }) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.table(rows);
                    menu();
                }
            });
        }
        //User chose to view eemployees table
        else if (userQuery.userChoice == 'View all employees') {

            pool.query('SELECT * FROM employees', function (err, { rows }) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.table(rows);
                    menu();
                }
            });
        }
    }
    //Check if user decided to add information onto one of these tables
    else if (userQuery.userChoice == 'Add a department' || userQuery.userChoice == 'Add a role' || userQuery.userChoice == 'Add an employee') {
        //Selected Add a Department
        if (userQuery.userChoice == 'Add a department') {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'department',
                        message: 'Name of new department?',
                    },
                ]).
                then((response) => pool.query(`INSERT INTO departments (name) VALUES ($1)`, [response.department], function (err, { rows }) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        menu();
                    }
                }));
        }
        //Selected Add a role
        else if (userQuery.userChoice == 'Add a role') {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'Name of new role title?',
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: "What is this role's expected salary?",
                    },
                    {
                        type: 'input',
                        name: 'department',
                        message: 'Using ID, which department will new role be under?',
                    },
                ]).
                then((response) => pool.query(`INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)`, [response.title, response.salary, response.department], function (err, { rows }) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        menu();
                    }
                }
                ));
        }
        //Selected Add an employee
        else if (userQuery.userChoice == 'Add an employee') {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'First name of new employee?',
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: "Last name of new employee?",
                    },
                    {
                        type: 'input',
                        name: 'employeeRole',
                        message: "Enter employee's role ID.",
                    },
                    {
                        type: 'input',
                        name: 'manager',
                        message: "Enter employee's manager ID."
                    },
                ]).
                then((response) => pool.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [response.firstName, response.lastName, response.employeeRole, response.manager], function (err, { rows }) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        menu();
                    }
                }));
        }

    }
    //Has user update one of the employee roles on the employees table
    else if (userQuery.userChoice == 'Update an employee role') {


        pool.query('SELECT * FROM employees', function (err, { rows }) {

            const employeeChoices = rows.map(row => ({
                name: `${row.first_name} ${row.last_name}`,
                empID: row.id,
                role: row.role_id,
                department: row.manager_id
            }));

            console.table(employeeChoices);


            pool.query('SELECT * FROM roles', function (err, { rows }) {

                const roleOptions = rows.map(row => ({
                    id: row.id,
                    title: row.title,
                    salary: row.salary,
                    manager: row.department_id
                }));

                console.table(roleOptions);

                inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'userUpdate',
                            message: 'Using the employee ID, which employee do you wish to update?',
                        },
                        {
                            type: 'input',
                            name: 'roleSelection',
                            message: 'Using the above table, choose the role ID for the new position?'
                        }
                    ]).
                    then((response) => pool.query(`UPDATE employees SET role_id=${response.roleSelection} WHERE id=${response.userUpdate}`, function (err, { rows }) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.table(rows);
                            menu();
                        }
                    }));
            })
        });
    }
}

menu();
