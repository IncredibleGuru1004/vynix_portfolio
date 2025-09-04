import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Load environment variables
dotenv.config();

// Firebase configuration - loaded from .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function setupAdminUser() {
  try {
    // Check if environment variables are loaded
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your_api_key_here') {
      console.error('❌ Firebase configuration not found!');
      console.log('Please create a .env.local file with your Firebase configuration.');
      console.log('You can copy from env.template and replace the placeholder values.');
      return;
    }

    console.log('Firebase configuration loaded successfully');
    console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const adminEmail = 'admin@vynix.com';
    const adminPassword = 'admin123';
    const adminDisplayName = 'Admin User';

    console.log('Creating admin user...');

    // Create admin user
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: adminDisplayName });

    // Create admin user document in Firestore
    const adminUser = {
      uid: user.uid,
      email: user.email,
      displayName: adminDisplayName,
      role: 'admin',
      isApproved: true,
      createdAt: new Date(),
      lastLoginAt: null
    };

    await setDoc(doc(db, 'adminUsers', user.uid), adminUser);

    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('UID:', user.uid);

  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️  Admin user already exists');
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }
  }
}

// Run the setup
setupAdminUser();
