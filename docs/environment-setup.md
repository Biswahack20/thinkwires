# Environment Setup & Configuration

## 1. Environment Variables Template

The project relies on clean separation between environment configs and application code. Never commit production secrets, private keys, or credentials to version control.

### Frontend Environment (`apps/frontend/.env`)
```env
# Base URL for API requests (Optional in dev, handled via Vite proxy)
VITE_API_BASE_URL=/api

# Application Mode
VITE_APP_ENV=development
```

### Backend Environment (`apps/backend/.env`)
```env
PORT=5000
NODE_ENV=development

# Database URIs (Use local or development instances)
DATABASE_URL=postgres://<username>:<password>@localhost:5432/thinkwire_db
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/thinkwires?retryWrites=true&w=majority

# Caching & Services
REDIS_URL=redis://localhost:6379
AI_SERVICE_URL=http://localhost:8000

# Authentication (64-byte random hex string)
JWT_SECRET=<secure_random_64_byte_hex_secret>

# Automated Recruitment Email Notification Settings
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=recruitment@example.com
SMTP_PASS=<smtp_password>
RECRUITMENT_NOTIFICATION_EMAIL=careers@thinkwires.com
EMAIL_FROM="ThinkWires Recruitment" <careers@thinkwires.com>
```

## 2. Setting Up Local Environment

1. Clone repository:
   ```bash
   git clone <repository-url>
   cd thinkwires
   ```
2. Install workspace dependencies:
   ```bash
   npm install
   ```
3. Prepare `.env` files in both `apps/backend/.env` and `apps/frontend/.env` based on the placeholders above.
4. Launch the full-stack development environment:
   ```bash
   npm run dev
   ```
   - Frontend starts at: `http://localhost:5173`
   - Backend API starts at: `http://localhost:5000`
