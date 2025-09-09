// urllist.js
// Component to render a list of shortened URLs

import React from "react";
import UrlCard from "./urlcard";
import { Typography, Box } from "@mui/material";
import { Log } from "../api/logmiddleware";

function UrlList({ urls }) {
    if (!urls || urls.length === 0) {
        Log("frontend", "info", "urllist", "No shortened URLs to display.");
        return (
            <Box sx={{ mt: 2 }}>
                <Typography variant="body1">No URLs shortened yet.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            {urls.map((urlData, index) => (
                <UrlCard key={index} data={urlData} />
            ))}
        </Box>
    );
}

export default UrlList;
