import "server-only";

import { cookies } from "next/headers";

// import { initializeServerApp, initializeApp } from "firebase/app";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// import { getAuth } from "firebase/auth";
import { getAuth } from "firebase-admin/auth";

import { getFirestore } from "firebase-admin/firestore";

// Load Firebase Admin credentials only from Cloud Functions config
function getFirebaseConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin environment variables. " +
        "Make sure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set."
    );
  }

  return { projectId, clientEmail, privateKey };
}

// Initialize Firebase Admin app
function getOrInitializeAdminApp() {
  if (!getApps().length) {
    const { projectId, clientEmail, privateKey } = getFirebaseConfig();

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
  return getApps()[0];
}

export async function getAuthenticatedAppForUser() {
  const firebaseServerApp = getOrInitializeAdminApp();
  const auth = getAuth(firebaseServerApp);
  const db = getFirestore(firebaseServerApp);
  const authIdToken = (await cookies()).get("__session")?.value;

  // Verify and decode the user's token if present
  let currentUser = null;
  if (authIdToken) {
    try {
      currentUser = await auth.verifyIdToken(authIdToken);
    } catch (error) {
      console.error("Invalid or expired Firebase ID token:", error);
    }
  }

  /* const firebaseServerApp = initializeServerApp(

    initializeApp(),
    {
      authIdToken,
    }
  );

  // const auth = getAuth(firebaseServerApp); */
  

  await auth.authStateReady();

  // return { firebaseServerApp, currentUser: auth.currentUser };
  return { firebaseServerApp, currentUser: auth.currentUser, db };
}