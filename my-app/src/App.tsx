import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CallbackPage from "./CallBack";
import HomePage from "./HomePage";
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/callback" element={<CallbackPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
