import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
const auth = getAuth(app);

async function createAdmin() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, 'admin@visafinance.com', 'Admin@1234');
    console.log('Successfully created admin user:', userCredential.user.uid);
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Admin user already exists.');
      process.exit(0);
    }
    console.error('Error creating user:', error);
    process.exit(1);
  }
}

createAdmin();
