// urlinput.js
// Component for inputting URLs and shortening them

import React, { useState } from "react";
import { TextField, Button, Grid, Box, Typography } from "@mui/material";
import { shortenUrl } from "./urlapi";
import { Log } from "../api/logmiddleware";
import { shortenUrl, getAllShortenedUrls, getOriginalUrl } from "./urlapi";

function UrlInput({ onNewShortened }) {
    const [urls, setUrls] = useState(
        Array(5).fill({ originalUrl: "", validity: "", shortcode: "", error: "" })
    );
    const [loading, setLoading] = useState(false);

    const handleChange = (index, field, value) => {
        const updated = [...urls];
        updated[index][field] = value.trim(); // trim input
        updated[index].error = ""; // reset error
        setUrls(updated);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const results = [];
        const updatedUrls = [...urls];

        for (let i = 0; i < urls.length; i++) {
            const { originalUrl, validity, shortcode } = urls[i];

            if (!originalUrl) continue; // skip empty rows

            // Client-side validation
            try {
                new URL(originalUrl.trim());
            } catch (err) {
                updatedUrls[i].error = "Invalid URL format.";
                Log("frontend", "warn", "urlinput", `Invalid URL at row ${i + 1}: ${originalUrl}`);
                continue;
            }

            let validityInt = parseInt(validity);
            if (isNaN(validityInt) || validityInt <= 0) {
                validityInt = 30; // default
            }

            try {
                const res = await shortenUrl(originalUrl.trim(), shortcode.trim(), validityInt);
                results.push(res);
            } catch (err) {
                updatedUrls[i].error = err.message || "Error shortening URL.";
                Log("frontend", "error", "urlinput", `Error shortening URL at row ${i + 1}: ${err.message}`);
            }
        }

        setUrls(updatedUrls);

        if (results.length > 0) {
            onNewShortened(results); // send results to parent
        }

        setLoading(false);
    };

    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
                Enter up to 5 URLs to shorten
            </Typography>
            <Grid container spacing={2}>
                {urls.map((url, index) => (
                    <Grid item xs={12} key={index}>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            <TextField
                                label="Original URL"
                                value={url.originalUrl}
                                onChange={(e) => handleChange(index, "originalUrl", e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Validity (minutes)"
                                value={url.validity}
                                onChange={(e) => handleChange(index, "validity", e.target.value)}
                                type="number"
                                sx={{ width: 150 }}
                            />
                            <TextField
                                label="Custom Shortcode"
                                value={url.shortcode}
                                onChange={(e) => handleChange(index, "shortcode", e.target.value)}
                                sx={{ width: 150 }}
                            />
                        </Box>
                        {url.error && (
                            <Typography color="error" variant="body2">
                                {url.error}
                            </Typography>
                        )}
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Processing..." : "Shorten URLs"}
                </Button>
            </Box>
        </Box>
    );
}

export default UrlInput;
