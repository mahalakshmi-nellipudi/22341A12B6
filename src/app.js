import React from "react";
import UrlInput from "./components/urlinput";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>React URL Shortener</h1>
        <Routes>
          <Route path="/" element={<UrlInput />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
