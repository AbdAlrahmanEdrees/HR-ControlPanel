## JWT Auth ##

## Roles Guard ##

## Swagger Documentation ##

## Efficient querying endpoints to enable the front-end traverse and discover and visualize the data as much as possible ##
A concise set of flexible, minimal endpoints for employee data, designed to cover all front-end querying, filtering, sorting, and aggregation needs with just a few endpoints.

## 📚 API Documentation

The API is fully documented using **Swagger (OpenAPI)**.

### Interactive UI
When the server is running, you can access the interactive documentation to test endpoints directly:
👉 **[http://localhost:3000/api](http://localhost:3000/api)**

### Static Specification
A `swagger-spec.json` file is also available in the root directory for importing into tools like **Postman** or **Insomnia**.




# 📊 HR Analytics & Employee Management API

A robust, production-ready REST API built with **NestJS**, **Prisma**, and **PostgreSQL**. This system manages employee attrition data, provides advanced filtering/aggregation for frontend dashboards, and secures operations via Role-Based Access Control (RBAC) and JWT Authentication.

Based on the [IBM HR Analytics Employee Attrition & Performance](https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset) dataset from Kaggle.

# Dataset: look inside scripts/ folder, you'll find it there.

---

## 🚀 Key Features

### 🔐 Security & Authentication

* **Dual-Token Architecture**: Implements secure **Access Tokens** (short-lived) and **Refresh Tokens** (long-lived) using Passport-JWT.
* **Email Verification**: Sign-up flows require OTP verification (Verify, Resend Code).
* **Password Management**: Secure reset password flows via email OTP.
* **RBAC (Role-Based Access Control)**:
* **Public**: Authentication endpoints.
* **Authenticated**: General read access.
* **Super Admin**: Exclusive rights to create/update/delete employees and manage users.



### 👥 Employee Management (The Core)

* **Advanced Querying (`GET /employees`)**:
* **Dynamic Filtering**: Filter by any categorical field (e.g., `Department`, `EducationField`) accepting case-insensitive inputs (e.g., "Human Resources" maps correctly to DB Enums).
* **Range Filtering**: Filter numeric fields using min/max logic (e.g., `minMonthlyIncome`, `maxAge`, `minYearsAtCompany`).
* **Sorting**: Sort results by any field in Ascending/Descending order.
* **Pagination**: Efficient `skip` and `take` pagination.


* **Analytics & Aggregation (`GET /employees/stats`)**:
* Dynamic grouping statistics (e.g., Average Salary by Department, Count by Job Role).



### 🛠 Technical Highlights

* **Database**: PostgreSQL hosted on **Aiven.io**.
* **ORM**: Prisma with strictly typed Enums and efficient schema mapping.
* **Documentation**: Fully integrated **Swagger/OpenAPI** documentation with DTO schemas and example responses.
* **Validation**: Strict DTO validation using `class-validator` and `class-transformer`.

---

## 🛠 Tech Stack

* **Framework**: [NestJS](https://nestjs.com/)
* **Language**: TypeScript
* **Database**: PostgreSQL
* **ORM**: [Prisma](https://www.prisma.io/)
* **Auth**: Passport, JWT, Bcrypt
* **Docs**: Swagger (OpenAPI)

---

## ⚙️ Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/malaz-hr-backend.git
cd malaz-hr-backend

```


2. **Install dependencies**
```bash
npm install

```


3. **Environment Configuration**
Create a `.env` file in the root directory and configure your variables:
```env
# Database (Aiven PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/defaultdb?sslmode=require"

# JWT Secrets
JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"

# Admin Setup (Optional)
SUPER_ADMIN_EMAIL="admin@example.com"

```


4. **Prisma Generation**
*Crucial Step:* Generate the Prisma Client to ensure TypeScript types match your schema.
```bash
npx prisma generate

```


5. **Run the Server**
```bash
# Development
npm run start:dev

# Production
npm run start:prod

```



---

## 📚 API Documentation

Once the server is running, visit the Swagger UI to explore endpoints, schemas, and test requests directly:

**URL:** `http://localhost:3000/api` (default)

### 1. Authentication Module (`/auth`)

Handles the user lifecycle.

* `POST /auth/local/signin`: Login via Email/Phone. Returns Access/Refresh tokens OR a verification requirement object.
* `POST /auth/refresh`: Rotate access tokens using a valid Refresh Token.
* `POST /auth/logout`: Invalidate the current session.
* `POST /auth/verify`: Verify account using OTP.
* `POST /auth/reset-password`: Reset forgotten passwords.

### 2. Employee Module (`/employees`)

The primary data source for the frontend dashboard.

**🔹 GET /employees (Filtering)**
This endpoint accepts a massive array of query parameters to slice and dice data.

* **Pagination:** `?skip=0&take=10`
* **Sorting:** `?sortBy=monthlyIncome&sortOrder=desc`
* **Categorical (Enums):** `?educationField=Marketing&department=Sales`
* *Note:* The API handles mapping intelligently (e.g., `Marketing` input maps to `MARKETING` database enum key).


* **Numeric Ranges:**
* `minAge` / `maxAge`
* `minMonthlyIncome` / `maxMonthlyIncome`
* `minYearsAtCompany` / `maxYearsAtCompany`
* ...and many more.



**🔹 GET /employees/stats (Analytics)**

* **Query:** `?groupBy=department` (or `jobRole`, `gender`, etc.)
* **Response:** Returns aggregated counts and averages for the requested group.

**🔹 Write Operations (Super Admin Only)**

* `POST /employees`: Create new employee.
* `PUT /employees`: Update existing employee.
* `DELETE /employees/:id`: Delete employee.

### 3. Users Module (`/users`)

Restricted to **Super Admin**.

* `GET /users`: List users or search by keyword (Name/Email/Phone/ID).
* `POST /users`: Register a new admin/user manually.
* `DELETE /users/:id`: Remove a user.

---

## 🗄️ Database Schema Context

This project uses a modified schema based on the "IBM HR Analytics" dataset.

**Key Enums Mapped:**
To ensure data consistency and clean code, specific mappings are handled between the API and Database:

* `EducationField`: 'Life Sciences', 'Medical', 'Marketing', 'Technical Degree', 'Human Resources', 'Other'.
* `Department`: 'Sales', 'Research & Development', 'Human Resources'.

---
