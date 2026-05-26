import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch(
        "http://localhost:3002/api/auth/login",
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await res.json();
      if (res.ok) {

        console.log("Email before save:", email);

        localStorage.setItem("token", data.accessToken);

        // 🔥 FORCE SAVE (SAFE VERSION)
        localStorage.setItem("email", email.trim());

        console.log("Saved email:", localStorage.getItem("email"));

        alert("Login successful");

        navigate("/admin/dashboard");
      }

      else {

        alert(data.message);

      }

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h1>Admin Login</h1>

        <form
          onSubmit={handleLogin}
          className="login-form"
        >
          <div className="input-group">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;