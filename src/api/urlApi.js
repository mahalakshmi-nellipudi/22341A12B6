// urlapi.js
// This file contains functions to handle URL shortening logic (client-side simulation)
// Uses logmiddleware for logging actions

import { Log } from "./logmiddleware";

// In-memory storage for URL mappings
const urlDatabase = {};  // { shortcode: { originalUrl, expiry } }

// Helper to generate random shortcode
function generateShortcode(length = 6) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let shortcode = "";
    for (let i = 0; i < length; i++) {
        shortcode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return shortcode;
}

// Function to shorten a single URL
export function shortenUrl(originalUrl, customShortcode = "", validityMinutes = 30) {
    return new Promise((resolve, reject) => {
        try {
            Log("frontend", "info", "urlapi", `Attempting to shorten URL: ${originalUrl}`);
            
            // Validate URL
            try {
                new URL(originalUrl);
            } catch (error) {
                Log("frontend", "error", "urlapi", `Invalid URL: ${originalUrl}`);
                return reject({ message: "Invalid URL format." });
            }

            // Validate validityMinutes
            if (!Number.isInteger(validityMinutes) || validityMinutes <= 0) {
                validityMinutes = 30; // default
            }

            // Determine shortcode
            let shortcode = customShortcode || generateShortcode();
            
            // Ensure uniqueness
            if (urlDatabase[shortcode]) {
                Log("frontend", "error", "urlapi", `Shortcode collision: ${shortcode}`);
                return reject({ message: "Shortcode already exists. Try a different one." });
            }

            // Set expiry timestamp
            const expiry = new Date(Date.now() + validityMinutes * 60 * 1000);

            // Store in database
            urlDatabase[shortcode] = { originalUrl, expiry };

            Log("frontend", "info", "urlapi", `Shortened URL created: ${shortcode} -> ${originalUrl}`);
            
            resolve({ shortcode, originalUrl, expiry });
        } catch (err) {
            Log("frontend", "fatal", "urlapi", `Error in shortenUrl: ${err}`);
            reject({ message: "Unexpected error occurred." });
        }
    });
}

// Function to retrieve original URL for redirection
export function getOriginalUrl(shortcode) {
    return new Promise((resolve, reject) => {
        const entry = urlDatabase[shortcode];
        if (!entry) {
            Log("frontend", "warn", "urlapi", `Shortcode not found: ${shortcode}`);
            return reject({ message: "Short URL does not exist." });
        }

        const now = new Date();
        if (entry.expiry < now) {
            Log("frontend", "warn", "urlapi", `Short URL expired: ${shortcode}`);
            delete urlDatabase[shortcode];
            return reject({ message: "Short URL has expired." });
        }

        Log("frontend", "info", "urlapi", `Redirecting shortcode: ${shortcode} -> ${entry.originalUrl}`);
        resolve(entry.originalUrl);
    });
}

// Function to get all shortened URLs for statistics page
export function getAllShortenedUrls() {
    const now = new Date();
    const list = [];
    for (const shortcode in urlDatabase) {
        if (urlDatabase[shortcode].expiry > now) {
            list.push({
                shortcode,
                originalUrl: urlDatabase[shortcode].originalUrl,
                expiry: urlDatabase[shortcode].expiry,
            });
        }
    }
    Log("frontend", "info", "urlapi", "Retrieved all shortened URLs for stats page.");
    return list;
}
