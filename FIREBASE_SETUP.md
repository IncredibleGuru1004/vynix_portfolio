# Firebase Authentication Setup Guide

This guide will help you set up Firebase authentication for the admin panel.

## Prerequisites

1. Firebase project created
2. Web app registered in Firebase Console
3. Authentication enabled in Firebase Console

## Setup Steps

### 1. Environment Variables

Create a `.env.local` file in the root directory with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Firebase Console Setup

1. **Enable Authentication:**
   - Go to Firebase Console → Authentication
   - Click "Get Started"
   - Go to "Sign-in method" tab
   - Enable "Email/Password" provider

2. **Set up Firestore Database:**
   - Go to Firebase Console → Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select a location for your database

3. **Configure Security Rules (Optional for development):**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /adminUsers/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         allow read: if request.auth != null && 
           get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```

### 3. Create Admin User

Run the setup script to create the initial admin user:

```bash
npm run setup-admin
```

This will create an admin user with:
- Email: `admin@vynix.com`
- Password: `admin123`
- Role: `admin`
- Status: `approved`

### 4. Test the Authentication

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/admin/login`
3. Sign in with the admin credentials
4. You should be redirected to the admin dashboard

## User Management

### Creating New Users

You can create new admin users programmatically using the `createAdminUser` function:

```typescript
import { createAdminUser } from '@/lib/firebase-auth'

// Create a new team member (requires admin approval)
const newUser = await createAdminUser(
  'user@example.com',
  'password123',
  'John Doe',
  'team-member'
)

// Create a new admin (auto-approved)
const newAdmin = await createAdminUser(
  'admin2@example.com',
  'password123',
  'Admin User 2',
  'admin'
)
```

### Approving Team Members

Team members need to be approved by an admin before they can access the admin panel. You can do this by updating the `isApproved` field in Firestore:

```typescript
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Approve a team member
await updateDoc(doc(db, 'adminUsers', userId), {
  isApproved: true
})
```

## Features

- ✅ Firebase Authentication integration
- ✅ Role-based access control (Admin vs Team Member)
- ✅ User approval system
- ✅ Persistent authentication state
- ✅ Automatic redirects for unauthenticated users
- ✅ Sign out functionality
- ✅ User profile display in sidebar

## Troubleshooting

### Common Issues

1. **"User not found in admin database"**
   - Make sure the user exists in the `adminUsers` collection in Firestore
   - Run the setup script to create the initial admin user

2. **"Account not approved by admin"**
   - The user needs to be approved by setting `isApproved: true` in Firestore
   - Only admins can approve other users

3. **Environment variables not loading**
   - Make sure `.env.local` is in the root directory
   - Restart the development server after adding environment variables

4. **Firebase connection issues**
   - Verify your Firebase configuration
   - Check that your Firebase project is active
   - Ensure the correct project ID is used

### Development vs Production

- **Development**: Uses Firebase emulators (if configured)
- **Production**: Uses live Firebase services
- Make sure to update security rules for production use
