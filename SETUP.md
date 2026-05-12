# BudgetCargo Setup Instructions

## Database Setup

The application requires a PostgreSQL database (Neon recommended) with the following tables.

### Running Migrations

1. **Get your Neon Database URL**
   - Go to your Neon dashboard
   - Copy the connection string (DATABASE_URL or NEON_DATABASE_URL)

2. **Set Environment Variables**
   - Add the following to your Vercel project environment variables:
     - `NEON_DATABASE_URL`: Your Neon database connection string
     - `STRIPE_SECRET_KEY`: Your Stripe secret key (for payment processing)
     - `TWILIO_ACCOUNT_SID`: Your Twilio account SID (optional, for WhatsApp notifications)
     - `TWILIO_AUTH_TOKEN`: Your Twilio auth token (optional)
     - `TWILIO_WHATSAPP_FROM`: Your Twilio WhatsApp number (optional)
     - `TWILIO_WHATSAPP_TO`: Your destination WhatsApp number (optional)

3. **Run the Migration**
   - Go to the Neon SQL Editor
   - Copy the contents of `migrations/001_init.sql`
   - Execute the SQL script to create the required tables:
     - `admin_accounts` - For admin authentication
     - `orders` - For storing order data

### Creating an Admin Account

After running the migration, you'll need to create an admin account to access the dashboard:

```sql
INSERT INTO admin_accounts (email, api_token) 
VALUES ('your-email@example.com', 'your-secure-api-token');
```

Generate a secure API token (e.g., using a password generator or UUID).

## Deployment

### Vercel Deployment

1. **Push your changes to GitHub**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. **Vercel will automatically deploy**
   - The build script copies necessary files to the public folder
   - Serverless functions in the `api/` directory are automatically deployed

3. **Verify Environment Variables**
   - Go to your Vercel project settings
   - Ensure all required environment variables are set

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run local server**
   ```bash
   npm start
   ```
   The site will be available at http://localhost:3000

3. **Note**: API endpoints won't work locally without database configuration. The quote flow will fall back to client-side calculation.

## Troubleshooting

### Logo 404 Error
- Ensure `logo.jpg` exists in the project root
- The build script should copy it to the public folder
- If the error persists, check the Vercel build logs

### Database Errors
- Ensure the migration has been run
- Verify `NEON_DATABASE_URL` is set correctly in Vercel
- Check the Neon database is accessible

### Payment Errors
- Ensure `STRIPE_SECRET_KEY` is set in Vercel
- Verify your Stripe account is active
- Check the Stripe dashboard for any issues
