// header.js
// App header component

import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Log } from "../api/logmiddleware";

function Header() {
    // Log rendering of header
    Log("frontend", "info", "header", "Header component rendered.");

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" component="div">
                    URL Shortener App
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
