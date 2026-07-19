// This directive tells Next.js that this file contains server-only code
"use server";

// Import the 'addReviewToRestaurant' function, which handles adding a new review to Firestore
import { addReviewToRestaurant } from "@/src/lib/firebase/firestore.js";

// Import a helper that authenticates a user and returns their Firebase app instance for server use
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";

// Import Firestore functions for database interaction from the Firebase SDK
// import { getFirestore } from "firebase/firestore";

// Import Firestore functions for database interaction from the Firebase Admin SDK (instead of the above browser SDK)
import { getFirestore } from "firebase-admin/firestore";

// NOTE: This function is a Next.js Server Action.
// Server Actions are an alpha feature that allows form submissions to directly invoke server-side logic.
// Use cautiously in production environments until the feature matures.
// Reference: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
export async function handleReviewFormSubmission(data) {
        // Authenticate the current user and retrieve their Firebase app instance
        const { app } = await getAuthenticatedAppForUser();

        // Initialize a Firestore database reference from the authenticated app
        const db = getFirestore(app);

        // Call the helper function to add a review to the specified restaurant
        // Extract form data fields using the FormData API
        await addReviewToRestaurant(db, data.get("restaurantId"), {
                text: data.get("text"),           // Review text content submitted by the user
                rating: data.get("rating"),       // Rating value (e.g., number from 1–5)
                
                // This field is populated from a hidden input in the form,
                // identifying which user submitted the review
                userId: data.get("userId"),
        });
}
