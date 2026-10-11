# YUTIRA 2026

A full-stack event management web application for participant registration, email verification, paper submissions, payment tracking, attendance management, and administrative workflows.

## Overview

YUTIRA 2026 is a web applicyoation built to support event information and participant management through a centralized platform. Visitors can explore event details, workshops, sponsors, FAQs, and contact information. Participants can register, verify their email addresses, manage their accounts, and submit paper abstracts through the application.

The administrative interface supports participant search, payment status management, attendance tracking, paper-submission decisions, and CSV exports.

## Key Features

- **Event Information:** Public pages for event details, workshops, sponsors, FAQs, and contact information.
- **Participant Registration:** Registration with server-side validation and email verification.
- **Authentication:** Login, logout, password reset, and JWT-based authentication using HTTP-only cookies.
- **Participant Dashboard:** View participant ID, payment status, attendance information, and paper-submission status.
- **Paper Submission:** Submit a paper or abstract through a PDF link.
- **Administration:** Manage participant records and access administrative workflows.
- **Participant Search:** Search participant records from the administrative interface.
- **Payment Tracking:** Update and review participant payment status.
- **Attendance Management:** Record and manage participant attendance.
- **Paper Decisions:** Manage paper-submission decisions.
- **CSV Export:** Export administrative data for reporting and record keeping.
- **Email Notifications:** Send verification and account-related emails through configurable SMTP settings.
- **Responsive Interface:** Shared components and page layouts built with Next.js and Tailwind CSS.

## Tech Stack

| Category           | Technologies                     |
| ------------------ | -------------------------------- |
| Framework          | Next.js 14, App Router           |
| Frontend           | React 18, JavaScript             |
| Styling            | Tailwind CSS, PostCSS            |
| Database           | MongoDB                          |
| Database Modeling  | Mongoose                         |
| Authentication     | JSON Web Tokens (`jsonwebtoken`) |
| Password Hashing   | `bcryptjs`                       |
| Email              | Nodemailer, SMTP                 |
| Data Export        | `csv-stringify`                  |
| Image Optimization | `sharp`                          |
| Package Management | npm                              |
| Deployment         | Node.js-compatible hosting       |

## System Architecture

The application uses the Next.js App Router for its public pages, participant dashboard, administrative interface, and API endpoints.

- **Presentation Layer:** React pages, shared components, and Tailwind CSS provide the user interface.
- **Application Layer:** Next.js API route handlers process registration, authentication, participant actions, and administrative operations.
- **Authentication and Validation:** Shared utilities handle authentication, request validation, and access checks.
- **Data Layer:** Mongoose models and database utilities connect the application to MongoDB.
- **Email Integration:** Nodemailer sends account-related emails through configurable SMTP settings.
- **Reporting:** Administrative functionality supports CSV data export.

## Project Structure

```text
yutira-2026/
├── app/
│   ├── about/              # About page
│   ├── admin/              # Administrative interface
│   ├── api/                # API route handlers
│   │   ├── admin/          # Administrative operations
│   │   ├── auth/           # Authentication endpoints
│   │   ├── me/             # Current-user endpoint
│   │   └── papers/         # Paper-submission endpoints
│   ├── contact/            # Contact page
│   ├── dashboard/          # Participant dashboard
│   ├── events/             # Event pages
│   ├── faq/                # Frequently asked questions
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── reset-password/     # Password-reset pages
│   ├── sponsors/           # Sponsor information
│   ├── workshop/           # Workshop information
│   ├── layout.js           # Root layout
│   ├── page.js             # Home page
│   └── globals.css         # Global styles
├── components/             # Reusable UI components
├── lib/                    # Authentication, database, validation,
│                           # email, and application utilities
├── models/                 # Mongoose data models
├── public/                 # Logos and public assets
├── .env.example            # Environment variable template
├── .gitignore              # Git exclusions
├── next.config.js          # Next.js configuration
├── package.json            # Scripts and dependencies
├── package-lock.json       # Locked dependency versions
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md
```

## Prerequisites

Before running the application, install:

- Node.js 18.17 or newer; a currently supported LTS release is recommended.
- npm.
- A MongoDB database, either a local instance or MongoDB Atlas.
- SMTP credentials if email delivery is required.
- Git for version control.

## Installation & Setup

**1. Clone the repository**

```bash
git clone <your-repository-url>
cd yutira-2026
```

Replace `<your-repository-url>` with your actual GitHub repository URL.

**2. Install dependencies**

```bash
npm ci
```

**3. Configure environment variables**

Create a local environment file from the supplied template.

On macOS or Linux:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

**4. Configure MongoDB and authentication**

Update `.env` with a valid MongoDB connection string, a strong random `JWT_SECRET`, and unique administrator credentials.

**5. Configure email**

If you need registration verification and password-reset emails, configure the SMTP variables in `.env`. For local development without email delivery, set:

```env
EMAIL_ENABLED=false
```

When email is disabled, users cannot receive verification or password-reset links through email.

**6. Start the development server**

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

**7. Build for production**

```bash
npm run build
npm run start
```

The production start command should be used after a successful build.

## Environment Variables

Configure these values in `.env`. Never commit the actual environment file or real credentials.

| Variable                | Required                               | Purpose                                                                         |
| ----------------------- | -------------------------------------- | ------------------------------------------------------------------------------- |
| `APP_URL`               | Yes                                    | Public base URL used to construct account verification and password-reset links |
| `JWT_SECRET`            | Yes                                    | Secret used to sign authentication tokens                                       |
| `MONGODB_URI`           | Yes                                    | MongoDB connection string                                                       |
| `ADMIN_EMAIL`           | Yes                                    | Administrator login email                                                       |
| `ADMIN_PASSWORD`        | Yes                                    | Administrator login password                                                    |
| `EMAIL_ENABLED`         | No                                     | Controls whether email delivery is enabled                                      |
| `SMTP_HOST`             | If email is enabled                    | SMTP server hostname                                                            |
| `SMTP_PORT`             | If email is enabled                    | SMTP server port                                                                |
| `SMTP_SECURE`           | If email is enabled                    | Controls secure SMTP connection settings                                        |
| `SMTP_USER`             | If email is enabled                    | SMTP username                                                                   |
| `SMTP_PASS`             | If email is enabled                    | SMTP password or provider-specific credential                                   |
| `SMTP_FROM_NAME`        | No                                     | Sender display name                                                             |
| `CLOUDINARY_CLOUD_NAME` | Not required by current implementation | Optional configuration template for a potential Cloudinary integration          |
| `CLOUDINARY_API_KEY`    | Not required by current implementation | Optional Cloudinary API key                                                     |
| `CLOUDINARY_API_SECRET` | Not required by current implementation | Optional Cloudinary API secret                                                  |

Next.js manages `NODE_ENV` automatically for standard development and production commands. Do not set it manually unless your deployment environment specifically requires it.

## Usage

After configuring the application and starting the development server, use the following workflows.

**Participant workflow**

1. Browse the public event information.
2. Register through `/register`.
3. Verify the account using the email link.
4. Sign in through `/login`.
5. Open `/dashboard` to view participant information and statuses.
6. Submit paper information through the available submission workflow.

**Administrator workflow**

1. Sign in using the configured administrator credentials.
2. Open `/admin`.
3. Search for participant records.
4. Manage payment status and attendance.
5. Review paper submissions and record decisions.
6. Export supported administrative data to CSV.

**Testing and validation**

The repository does not currently include a dedicated automated test suite. Before making changes or deploying, verify the affected workflows manually and run:

```bash
npm run build
```

The `lint` script is defined in `package.json`, but the project does not currently include a complete ESLint configuration. Configure linting before relying on it as a validation step.

Review the event deadlines in `lib/data.js` before reusing the application. The supplied configuration contains March 2026 deadlines, which have already passed.

## Deployment

YUTIRA 2026 requires a Node.js-compatible hosting platform and a reachable MongoDB database. GitHub Pages alone cannot host the application's server-side API routes.

1. Push the source code to GitHub.
2. Provision MongoDB or configure a MongoDB Atlas database.
3. Deploy the repository to a compatible platform, such as Vercel or another Node.js host.
4. Configure the environment variables in the hosting dashboard.
5. Set `APP_URL` to the deployed HTTPS address.
6. Set a unique, strong `JWT_SECRET` and secure administrator credentials.
7. Configure SMTP if email verification and password-reset delivery are required.
8. Build and start the application using the platform's supported Next.js deployment process.
9. Test registration, email verification, login, password reset, dashboard access, administrative permissions, CSV export, and paper submission.
10. Update expired event dates and verify all public links before opening the application to users.

Do not expose database credentials, SMTP passwords, authentication secrets, or administrator credentials in the repository. Back up production data before making database or deployment changes.

## Future Improvements

Potential enhancements include:

- Add automated tests for authentication, registration, and administrative workflows.
- Configure ESLint and add consistent code-quality checks.
- Add role-based administrative access if multiple administrator roles are required.
- Improve monitoring and error reporting for email delivery.
- Add automated deployment checks and continuous integration.
- Review event deadlines and make event configuration easier to maintain.
- Evaluate security controls and rate limiting for public authentication endpoints.

These are potential improvements, not claims that they are already implemented.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch for your change.
3. Follow the existing JavaScript and component conventions.
4. Keep changes focused and update documentation when necessary.
5. Run `npm run build` and test affected workflows.
6. Submit a pull request describing the change and the validation performed.

## License

A standalone `LICENSE` file has not been included in the supplied project archive. Licensing will be added consistently across the project repositories in the final licensing step.
