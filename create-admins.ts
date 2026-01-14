
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.VITE_SUPABASE_URL || "https://kivzetswolixpuvgfefc.supabase.co";
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdnpldHN3b2xpeHB1dmdmZWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MzI3NDksImV4cCI6MjA4MzUwODc0OX0.eMKA-Bb_6ScjfY6joWSn-qHef5s2ZhaVg0E64Liqgdg";

const supabase = createClient(url, key);

const admins = [
    { email: "tribushany@gmail.com", password: "Tribushany100500+" },
    { email: "timonlondon85@gmail.com", password: "$Art091085EMKA85%" }
];

async function createUsers() {
    console.log("Starting user creation...");
    for (const admin of admins) {
        console.log(`Creating user: ${admin.email}`);
        const { data, error } = await supabase.auth.signUp({
            email: admin.email,
            password: admin.password,
        });

        if (error) {
            console.error(`Error creating ${admin.email}:`, error.message);
        } else {
            console.log(`Success! User ${admin.email} created with ID:`, data.user?.id);
            if (data.session) {
                console.log("Session created (Auto-login successful)");
            } else {
                console.log("No session returned. Email verification might be required.");
            }
        }
    }
}

createUsers();
