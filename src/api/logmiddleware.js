// logmiddleware.js
// Reusable Logging Middleware for OA platform
// Logs actions via a mock API call (can be replaced with real endpoint if needed)

export function Log(stack, level, packageName, message) {
    // Example stack: "frontend" | "backend"
    // level: "debug" | "info" | "warn" | "error" | "fatal"
    // packageName: which part of the app (frontend, backend, or both)
    // message: log message string

    const logEntry = {
        stack,
        level,
        package: packageName,
        message,
        timestamp: new Date().toISOString(),
    };

    // For demonstration, we simulate an API call using fetch (replace URL with real endpoint if needed)
    fetch("https://example-log-api.com/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logEntry),
    })
    .then(response => response.json())
    .then(data => {
        // Successfully logged
        // We can optionally return logID from API
        // console.log("Log ID:", data.logID);  // Do NOT use console.log in OA
    })
    .catch(err => {
        // If logging fails, just ignore or handle silently
        // console.warn("Logging failed:", err); // Do NOT use console.log
    });
}
