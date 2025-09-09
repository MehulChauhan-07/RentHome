# RentHome Server

A robust Express.js backend for the RentHome rental property platform with MongoDB, Google OAuth2, and comprehensive API endpoints.

## Features

- **Authentication System**
  - Google OAuth2 integration
  - Local authentication with JWT tokens
  - Role-based access control (User, Owner, Admin)
  - Password hashing with bcrypt

- **Property Management**
  - CRUD operations for properties
  - Advanced search and filtering
  - Image upload support
  - Property approval workflow

- **User Management**
  - User profiles with preferences
  - Owner account upgrades
  - Favorites and bookings tracking

- **Admin Dashboard**
  - User and property management
  - Analytics and reporting
  - Content moderation

## Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js (Google OAuth2 + JWT)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Password Hashing**: bcryptjs

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

3. **Configure Environment Variables**
   Edit `.env` file with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/renthome
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   
   # Server
   PORT=5000
   CLIENT_URL=http://localhost:5173
   
   # Admin
   ADMIN_EMAIL=admin@renthome.com
   ```

4. **Database Setup**
   
   Make sure MongoDB is running, then seed the database:
   ```bash
   npm run seed
   ```

## Development

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Seed database with sample data
npm run seed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Properties
- `GET /api/properties` - Get all properties (with filtering)
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property (Owner/Admin)
- `PUT /api/properties/:id` - Update property (Owner/Admin)
- `DELETE /api/properties/:id` - Delete property (Owner/Admin)
- `POST /api/properties/:id/favorite` - Add to favorites
- `DELETE /api/properties/:id/favorite` - Remove from favorites

### Users
- `GET /api/users/favorites` - Get user's favorites
- `GET /api/users/properties` - Get user's properties
- `GET /api/users/bookings` - Get user's bookings
- `POST /api/users/upgrade-to-owner` - Upgrade to owner account

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Manage users
- `PUT /api/admin/users/:id` - Update user
- `GET /api/admin/properties` - Manage properties
- `PUT /api/admin/properties/:id/status` - Approve/reject property
- `PUT /api/admin/properties/:id/featured` - Toggle featured status

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

## Database Schema

### User Model
- Basic info (name, email, phone)
- Authentication (password, Google ID)
- Roles (user, owner, admin)
- Preferences and settings
- Property and booking references

### Property Model
- Property details (title, description, price)
- Location information
- Property specs (bedrooms, bathrooms, area)
- Images and amenities
- Availability and status
- Owner reference and verification

### Booking Model
- User and property references
- Date ranges and pricing
- Guest information
- Payment and status tracking
- Reviews and ratings

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS configuration
- Input validation and sanitization
- SQL injection protection (NoSQL)
- Helmet for security headers

## File Upload

Images are uploaded to the `uploads` directory. In production, consider using cloud storage like AWS S3 or Cloudinary.

## Error Handling

The server includes comprehensive error handling with:
- Mongoose validation errors
- JWT authentication errors
- Custom error responses
- Development vs production error details

## Testing

```bash
npm test
```

## Deployment

The server is configured for Vercel deployment with the included `vercel.json` file.

For other platforms, ensure:
- Environment variables are set
- MongoDB connection is configured
- File upload directory exists
- CORS settings match your frontend domain

## Sample Accounts (After Seeding)

**Admin Account:**
- Email: admin@renthome.com
- Password: AdminPassword123!

**Owner Account:**
- Email: john@example.com
- Password: Password123!

## Support

For issues and questions, please check the documentation or create an issue in the repository.
