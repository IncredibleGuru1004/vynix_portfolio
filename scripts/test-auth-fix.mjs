import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function testAuthFix() {
  try {
    console.log('🧪 Testing Authentication Fix...\n');

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Test 1: Sign in as admin
    console.log('1. Signing in as admin...');
    const adminCredential = await signInWithEmailAndPassword(auth, 'admin@vynix.com', 'admin123');
    const adminUser = adminCredential.user;
    console.log('✅ Admin signed in:', adminUser.email);

    // Get admin user data
    const adminDoc = await getDoc(doc(db, 'adminUsers', adminUser.uid));
    const adminData = adminDoc.data();
    console.log('✅ Admin role:', adminData.role);
    console.log('✅ Admin approved:', adminData.isApproved);

    // Test 2: Simulate team member approval (using API endpoint)
    console.log('\n2. Testing team member creation via API...');
    
    const testTeamMember = {
      email: 'test-member@vynix.com',
      firstName: 'Test',
      lastName: 'Member',
      position: 'Developer'
    };

    try {
      const response = await fetch('http://localhost:3000/api/admin/create-team-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testTeamMember),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Team member created successfully via API');
        console.log('✅ Generated password:', result.data.password);
      } else {
        console.log('❌ Failed to create team member:', result.error);
      }
    } catch (apiError) {
      console.log('⚠️  API call failed (server might not be running):', apiError.message);
    }

    // Test 3: Verify admin session is still active
    console.log('\n3. Verifying admin session is still active...');
    const currentUser = auth.currentUser;
    
    if (currentUser && currentUser.email === 'admin@vynix.com') {
      console.log('✅ Admin session maintained!');
      console.log('✅ Current user:', currentUser.email);
      
      // Get updated admin data
      const currentAdminDoc = await getDoc(doc(db, 'adminUsers', currentUser.uid));
      const currentAdminData = currentAdminDoc.data();
      console.log('✅ Current user role:', currentAdminData.role);
    } else {
      console.log('❌ Admin session was lost!');
      console.log('❌ Current user:', currentUser?.email || 'None');
    }

    // Test 4: Sign out
    console.log('\n4. Signing out...');
    await signOut(auth);
    console.log('✅ Admin signed out successfully');

    console.log('\n🎉 Test completed!');
    console.log('\nKey Points:');
    console.log('- Admin session should remain active during team member approval');
    console.log('- API endpoint creates team members without affecting current session');
    console.log('- Admin user data should not change during the process');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAuthFix();
