# 🏢 SAIL Gate Pass Entry/Exit Control System

A full-stack web application for managing gate passes at Steel Authority of India Limited (SAIL). Built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **SQLite** database.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Secure login/registration with password hashing (bcrypt) |
| 📧 **Email OTP Verification** | OTP-based email verification for new users |
| 📝 **Complete Profile** | Collect government ID, address, emergency contact, profile photo |
| 📝 **Application Submission** | Users can apply for gate passes with visit details |
| 🔒 **Security Review** | Security personnel can review and forward applications |
| ✅ **Department Approval** | Department admins can approve/reject applications |
| 📱 **QR Code Generation** | Automatic QR code generation for approved passes |
| 💾 **Persistent Database** | All data is saved permanently using SQLite |
| 🎨 **Modern UI** | Beautiful interface with shadcn/ui components |

---

## 🆕 New Registration Flow

```
┌──────────────┐    ┌─────────────────┐    ┌──────────────────┐    ┌────────────┐
│   Register   │───▶│  Email OTP      │───▶│  Complete        │───▶│  Dashboard │
│   Account    │    │  Verification   │    │  Profile         │    │            │
└──────────────┘    └─────────────────┘    └──────────────────┘    └────────────┘
                          │                        │
                    Check terminal           Fill in:
                    for OTP code            - Date of Birth
                    (6 digits)              - Government ID
                                            - Address
                                            - Emergency Contact
                                            - Profile Photo
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: Custom with bcrypt password hashing
- **Email**: Nodemailer (Gmail, Outlook, or any SMTP)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **QR Generation**: qrcode library

---

## 📧 Email Configuration

By default, OTP codes are printed to the **console** (demo mode). To send **real emails**, follow these steps:

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update `.env` file**:
```env
EMAIL_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@gmail.com
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx
EMAIL_FROM_NAME=SAIL Gate Pass System
```

### Option 2: Outlook/Hotmail

```env
EMAIL_ENABLED=true
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@outlook.com
SMTP_PASSWORD=your-password
EMAIL_FROM_NAME=SAIL Gate Pass System
```

### Option 3: Yahoo Mail

```env
EMAIL_ENABLED=true
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@yahoo.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM_NAME=SAIL Gate Pass System
```

### Demo Mode (Default)

If `EMAIL_ENABLED=false`, OTP codes are printed to the terminal:

```
═══════════════════════════════════════════════════════════════════
📧 EMAIL SENT (Demo Mode - Check Console)
═══════════════════════════════════════════════════════════════════
To: user@example.com

  Your OTP for email verification is:

  ╔═══════════════════════╗
  ║       847293          ║
  ╚═══════════════════════╝

  ⏱️  This OTP is valid for 10 minutes.
═══════════════════════════════════════════════════════════════════
```

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

| Software | Version | Download |
|----------|---------|----------|
| **Node.js** | v18.17.0+ | [nodejs.org](https://nodejs.org/) |
| **npm** | v9.0.0+ | Comes with Node.js |
| **VS Code** | Latest | [code.visualstudio.com](https://code.visualstudio.com/) |

---

## 🚀 Quick Setup (One Command)

After extracting the project, run this single command to set everything up:

```bash
npm run setup
```

This command will:
1. ✅ Install all dependencies
2. ✅ Generate Prisma client
3. ✅ Create the SQLite database
4. ✅ Seed the database with demo users

Then start the development server:

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 📖 Step-by-Step Setup (Detailed)

### Step 1: Extract the Project

Extract the ZIP file to your desired location (e.g., `C:\Projects\gate-pass-system` or `~/Projects/gate-pass-system`)

### Step 2: Open in VS Code

1. Open VS Code
2. Go to `File` → `Open Folder`
3. Select the extracted project folder
4. VS Code will open the project

### Step 3: Open Terminal in VS Code

Press `` Ctrl + ` `` (backtick) or go to `Terminal` → `New Terminal`

### Step 4: Install Dependencies

```bash
npm install
```

Wait for all packages to install (this may take 1-2 minutes).

### Step 5: Set Up the Database

```bash
# Generate Prisma client
npm run db:generate

# Create database and tables
npm run db:push

# Add demo users to database
npm run db:seed
```

You should see output like:
```
🌱 Starting database seed...
🗑️  Clearing existing data...
🏢 Creating departments...
👥 Creating demo users...
   ✅ Created user: user@example.com
   ✅ Created security: security@company.com
   ✅ Created HR admin: hr@company.com
   ✅ Created IT admin: it@company.com
   ✅ Created Finance admin: finance@company.com
📝 Creating sample application...
✨ Database seeded successfully!
```

### Step 6: Start the Development Server

```bash
npm run dev
```

### Step 7: Open the Application

Open your browser and go to: **http://localhost:3000**

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **User** | user@example.com | password123 |
| **Security** | security@company.com | password123 |
| **HR Admin** | hr@company.com | password123 |
| **IT Admin** | it@company.com | password123 |
| **Finance Admin** | finance@company.com | password123 |

---

## 📁 Project Structure

```
gate-pass-entry-system/
├── app/                      # Next.js App Router pages
│   ├── dashboard/            # User dashboard
│   ├── security/             # Security dashboard
│   ├── department/           # Department admin dashboard
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   └── debug/                # Debug page (view all data)
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   └── qr-code-display.tsx   # QR code component
├── lib/                      # Utility functions
│   ├── auth.ts               # Authentication logic
│   ├── database.ts           # Database operations
│   ├── prisma.ts             # Prisma client singleton
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Helper utilities
├── prisma/                   # Database configuration
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding script
├── public/                   # Static assets
├── .env                      # Environment variables
└── package.json              # Project dependencies
```

---

## 🗄️ Database Schema

### Users Table
| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| email | String | User email (unique) |
| name | String | Full name |
| phone | String | Phone number |
| password | String | Hashed password |
| role | String | user / security / department_admin |
| department | String? | Department (for admins) |
| createdAt | DateTime | Account creation date |

### Applications Table
| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| userId | String | Reference to User |
| userName | String | Applicant name |
| purpose | String | Purpose of visit |
| department | String | Target department |
| visitDate | String | Date of visit |
| visitTime | String | Time of visit |
| status | String | pending/forwarded/approved/rejected |
| qrCode | String? | QR code data (JSON) |
| createdAt | DateTime | Application date |

---

## 🔄 Application Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│    USER     │────▶│   SECURITY   │────▶│   DEPARTMENT    │────▶│  QR CODE     │
│  Submits    │     │   Reviews    │     │    Approves     │     │  Generated   │
│ Application │     │ & Forwards   │     │   or Rejects    │     │  for User    │
└─────────────┘     └──────────────┘     └─────────────────┘     └──────────────┘
    Status:             Status:              Status:
    PENDING           FORWARDED         APPROVED/REJECTED
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run setup` | Full setup (install + db) |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:reset` | Reset database and reseed |

---

## 🔧 Database Management

### View Database in Browser (Prisma Studio)

```bash
npm run db:studio
```

This opens a web-based GUI at **http://localhost:5555** where you can:
- View all tables and data
- Add/edit/delete records
- Run queries

### Reset Database (Clear All Data)

```bash
npm run db:reset
```

This will delete all data and recreate demo users.

### Manually Add a User

You can add users through the Registration page at `/register` or via Prisma Studio.

---

## 🧪 Testing the Full Flow

### 🆕 Test NEW User Registration (with OTP verification)

1. **Go to Register Page**
   - Open http://localhost:3000/register
   - Fill in: Name, Email, Phone, Role, Password

2. **Check Terminal for OTP**
   - After clicking "Create Account", check your terminal
   - You'll see a box with a 6-digit OTP code like:
   ```
   ═══════════════════════════════════════════════════════════
   📧 EMAIL SENT (Mock - Check Console)
   ═══════════════════════════════════════════════════════════
   To: your.email@example.com
   
     Your OTP for email verification is:
   
     ┌─────────────────┐
     │     123456      │
     └─────────────────┘
   ═══════════════════════════════════════════════════════════
   ```

3. **Enter OTP**
   - Enter the 6-digit code on the verification page
   - Click "Verify Email"

4. **Complete Your Profile**
   - Fill in personal details (DOB, Gender)
   - Enter Government ID (Aadhaar, PAN, etc.)
   - Add address information
   - Upload profile photo (optional)
   - Add emergency contact details

5. **Access Dashboard**
   - After completing profile, you'll be redirected to your dashboard
   - You can now create gate pass applications!

---

### Test Demo Users (Pre-verified)

For quick testing without the registration flow:
1. Go to http://localhost:3000
2. Login with `user@example.com` / `password123`
3. Click "New Application"
4. Fill in the form:
   - Purpose: "Meeting with HR"
   - Department: HR
   - Date: Tomorrow's date
   - Time: 10:00
   - Duration: 2 hours
5. Click "Submit Application"
6. See the application with "Pending" status

### 2. Test as Security
1. Open a new incognito/private window
2. Login with `security@company.com` / `password123`
3. Find the pending application
4. Click "Review & Process"
5. Add comments: "Verified, forwarding to HR"
6. Click "Forward to HR"

### 3. Test as HR Admin
1. Login with `hr@company.com` / `password123`
2. See the forwarded application
3. Click "Review Application"
4. Add comments: "Approved for meeting"
5. Click "Approve & Generate QR"

### 4. See the Result (Back as User)
1. Go back to the user window
2. Refresh the page
3. See the approved application with QR code!
4. Download or print the QR code

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"

```bash
npm run db:generate
```

### Error: "Database file not found"

```bash
npm run db:push
npm run db:seed
```

### Error: Port 3000 already in use

```bash
# Kill the process using port 3000
npx kill-port 3000

# Or run on a different port
npm run dev -- -p 3001
```

### Reset Everything

```bash
# Delete node_modules and reinstall
rm -rf node_modules .next
npm install
npm run setup
```

---

## 🔒 Security Features

| Feature | Implementation |
|---------|----------------|
| Password Hashing | bcrypt with salt rounds |
| Session Management | HTTP-only cookies |
| Input Validation | Server-side validation |
| SQL Injection Prevention | Prisma ORM parameterized queries |

---

## 🚀 Production Deployment

For production, consider:

1. **Change to PostgreSQL**:
   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/dbname"
   ```
   Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Set secure environment variables**
3. **Enable HTTPS**
4. **Add rate limiting**
5. **Set up proper logging**

---

## 📞 Support

For issues or questions:
1. Check the `/debug` page for application data
2. Check the terminal for error logs
3. Run `npm run db:studio` to inspect the database

---

## 📄 License

This project is proprietary software for SAIL internal use.

---

**Happy coding! 🎉**
