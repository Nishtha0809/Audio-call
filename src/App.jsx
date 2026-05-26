// FILE: src/App.jsx

import React, { useEffect } from "react";

import {
  Routes,
  Route
} from "react-router-dom";

import Home from "./Pages/Home";
import Articles from "./Pages/Articles";
import Vlogs from "./Pages/Vlogs";
import Login from "./Pages/Login";
import SingleArticle from "./Pages/SingleArticle";
import SingleVlog from "./Pages/SingleVlog";

import Dashboard from "./Admin/Dashboard";
import AddArticle from "./Admin/AddArticle";
import AddVlog from "./Admin/AddVlog";

import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";

import AudioCall from "./Admin/AudioCall";



function App() {

  // =========================================
  // AUTO REFRESH TOKEN FUNCTION
  // =========================================

  useEffect(() => {

    // Function to get new access token
    const refreshAccessToken = async () => {

      try {

        // Get refresh token from localStorage
        const refreshToken =
          localStorage.getItem("refreshToken");

        // If no refresh token stop
        if (!refreshToken) return;

        // API call to backend
        const res = await fetch(
          "http://localhost:3002/api/auth/refresh",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              refreshToken
            })
          }
        );

        // Convert response
        const data = await res.json();

        // If success
        if (res.ok) {

          // Save new access token
          localStorage.setItem(
            "token",
            data.token
          );

          console.log("Access token refreshed");

        } else {

          // If refresh token invalid
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");

          console.log("Session expired");

        }

      } catch (error) {

        console.log(error);

      }
    };

    // =========================================
    // CALL EVERY 14 MINUTES
    // =========================================

    const interval = setInterval(() => {

      refreshAccessToken();

    }, 14 * 60 * 1000);

    // Cleanup
    return () => clearInterval(interval);

  }, []);

  // =========================================
  // ROUTES
  // =========================================

  return (

    <>

      {/* NAVBAR */}
      <Navbar />

      <Routes>

        {/* =========================================
            PUBLIC ROUTES
        ========================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/articles"
          element={<Articles />}
        />

        <Route
          path="/articles/:id"
          element={<SingleArticle />}
        />

        <Route
          path="/vlogs"
          element={<Vlogs />}
        />

        <Route
          path="/vlog/:id"
          element={<SingleVlog />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =========================================
            PROTECTED ADMIN ROUTES
        ========================================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-article"
          element={
            <ProtectedRoute>
              <AddArticle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-vlog"
          element={
            <ProtectedRoute>
              <AddVlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audio-call"
          element={
            <ProtectedRoute>
              <AudioCall />
            </ProtectedRoute>
          }
        />

      </Routes>

    </>
  );
}

export default App;