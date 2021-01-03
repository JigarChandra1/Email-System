# Email System

 Assignment by TANG

<h1> Problem Statement

Create an Rest API service that does the following:

1. Manages a list of bad email addresses.
2. Define CRUD APIs for: adding an email to the system, removing an email address from the system, marking an email address as RISKY or ALLOWED and fetch the status of an email address
3. Add email API should check if the email is disposable(has a '+' sign like: john.doe+temp@work.com). If it is, should mark the email as RISKY. If not, mark the email as ALLOWED.
4. Read email status API should give email address as input and email status as response. If this API is called more than 10 times in an hour for the same email, mark the email as RISKY.
5. Update email status API should override the current status of email and mark the status as specified in the input.
6. Remove email API should "soft-remove" the email address from the system. It shouldn't delete the email address permanently.

<h1> Setup

<h2> 1. Locally

**Prequisites**

Install Node (v10.9.0) , npm, PostgresSQL (12.5)

Created following DBs in PostgresSQL:
1. email_system
2. email_system_dev
Migrate the dev DB using the command `sequelize db:migrate`
Create a .env file using the .env.template file as a reference

<h2> 2. On Heroku

Connect the git repo to a new Heroku app
Provision an add-on for PostgresSQL

<h1> Running the app

Run command `npm run dev`

<h1> Running tests

Run command `npm run test`
