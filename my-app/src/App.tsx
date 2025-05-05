import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CallbackPage from "./CallBack";

const CASDOOR_CLIENT_ID = "559e37c6271af97b3566";
const CASDOOR_REDIRECT_URI = "https://localhost:3000/auth/casdoor/callback";
const CASDOOR_AUTH_URL = "https://localhost:8443/login/oauth/authorize";

const App = () => {
  const handleLogin = () => {
    const authUrl = `${CASDOOR_AUTH_URL}?client_id=${CASDOOR_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      CASDOOR_REDIRECT_URI
    )}&response_type=code&scope=openid profile email`;
    window.location.href = authUrl; // Переадресовуємо на Casdoor
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <button onClick={handleLogin}>Login with Casdoor</button>
        </header>

        <Routes>
          <Route path="/callback" element={<CallbackPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
