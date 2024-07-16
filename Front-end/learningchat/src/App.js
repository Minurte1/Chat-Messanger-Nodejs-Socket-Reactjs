import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Chat from "./view/Chat";
import Login from "../src/component/Login";
import Register from "./component/Register";

function App() {
  return (
    <>
      <Router>
        <div className="app-header">
          <Routes>
            <Route
              path="/message/*"
              element={
                <>
                  <Chat />
                </>
              }
            />
            <Route
              path="/"
              element={
                <>
                  <Login />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Register />
                </>
              }
            />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={2000} draggable />
      </Router>
    </>
  );
}

export default App;
