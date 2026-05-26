import React, { useEffect, useState } from "react";
import "../Styles/AddArticle.css";
import { useNavigate } from "react-router-dom";

function AddArticle() {

  const navigate = useNavigate();

  // TOKEN
  let token = localStorage.getItem("token");

  // STATES
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [articles, setArticles] = useState([]);
  const [editId, setEditId] = useState(null);

  // DEFAULT IMAGE
  const defaultImage =
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3";

  // =========================
  // REFRESH ACCESS TOKEN
  // =========================

  const refreshAccessToken = async () => {

    try {

      const res = await fetch(
        "http://localhost:3002/api/auth/refresh",
        {
          method: "POST",

          credentials: "include" //"Send cookies along with the request."
        }
      );

      const data = await res.json();

      if (res.ok) {

        localStorage.setItem(
          "token",
          data.accessToken
        );

        return data.accessToken;
      }

      return null;

    } catch (error) {

      console.log(error);

      return null;
    }
  };

  // =========================
  // GET ARTICLES
  // =========================

  useEffect(() => {

    fetch("http://localhost:3002/api/articles")

      .then((res) => res.json())

      .then((data) => setArticles(data))

      .catch((err) => console.log(err));

  }, []);

  // SUBMIT

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      title.trim() === "" ||
      description.trim() === ""
    ) {

      alert("Please fill all fields");

      return;
    }

    const payload = {

      title,
      description,
      image: image || defaultImage

    };

    try {

      // =========================
      // UPDATE
      // =========================

      if (editId) {

        const res = await fetch(
          `http://localhost:3002/api/articles/${editId}`,
          {
            method: "PUT",

            headers: {

              "Content-Type": "application/json",

              Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(payload)
          }
        );

        const data = await res.json();

        // TOKEN EXPIRED
        if (
          !res.ok &&
          data.message === "Token expired"
        ) {

          const newToken =
            await refreshAccessToken();

          if (!newToken) {

            alert("Session expired");

            navigate("/login");

            return;
          }

          token = newToken;

          handleSubmit(e);

          return;
        }

        // OTHER ERROR
        if (!res.ok) {

          alert(data.message);

          return;
        }

        // UPDATE UI
        setArticles(

          articles.map((a) =>

            a._id === editId
              ? data.article
              : a

          )

        );

        setEditId(null);

      }

      // =========================
      // CREATE
      // =========================

      else {

        const res = await fetch(
          "http://localhost:3002/api/articles",
          {
            method: "POST",

            headers: {

              "Content-Type": "application/json",

              Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(payload)
          }
        );

        const data = await res.json();

        // TOKEN EXPIRED
        if (
          !res.ok &&
          data.message === "Token expired"
        ) {

          const newToken =
            await refreshAccessToken();

          if (!newToken) {

            alert("Session expired");

            navigate("/login");

            return;
          }

          token = newToken;

          handleSubmit(e);

          return;
        }

        // OTHER ERROR
        if (!res.ok) {

          alert(data.message);

          return;
        }

        // ADD TO UI
        setArticles([
          data.article,
          ...articles
        ]);

      }

      // CLEAR INPUTS
      setTitle("");
      setDescription("");
      setImage("");

    } catch (error) {

      console.log(error);

    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete?"
    );

    if (!confirmDelete) return;

    try {

      const res = await fetch(
        `http://localhost:3002/api/articles/${id}`,
        {
          method: "DELETE",

          headers: {

            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      // TOKEN EXPIRED
      if (
        !res.ok &&
        data.message === "Token expired"
      ) {

        const newToken =
          await refreshAccessToken();

        if (!newToken) {

          alert("Session expired");

          navigate("/login");

          return;
        }

        token = newToken;

        handleDelete(id);

        return;
      }

      // OTHER ERROR
      if (!res.ok) {

        alert(data.message);

        return;
      }

      // REMOVE FROM UI
      setArticles(

        articles.filter((a) =>
          a._id !== id
        )

      );

    } catch (error) {

      console.log(error);

    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (article) => {

    setTitle(article.title);

    setDescription(article.description);

    setImage(article.image);

    setEditId(article._id);

    window.scrollTo({

      top: 0,
      behavior: "smooth"

    });
  };

  // =========================
  // UI
  // =========================

  return (

    <div className="page">

      <div className="header">

        <h1>
          {editId
            ? "Edit Article"
            : "Add Article"}
        </h1>

      </div>

      <div className="card">

        <h2>Article Form</h2>

        <form
          onSubmit={handleSubmit}
          className="form"
        >

          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <textarea
            placeholder="Enter Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Enter Image URL"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
          />

          <button type="submit">

            {editId
              ? "Update Article"
              : "Add Article"}

          </button>

          <button
            type="button"
            className="dashboard-btn"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            ← Back to Dashboard
          </button>

        </form>

      </div>

      {/* ARTICLES */}

      <div className="articles">

        {articles

          .filter((article) => article)

          .map((article) => (

            <div
              key={article._id}
              className="articleCard"
            >

              <img
                src={
                  article.image || defaultImage
                }
                alt="article"
              />

              <h3>{article.title}</h3>

              <p>

                {article.description.length > 80

                  ? article.description.substring(0, 80) + "..."

                  : article.description}

              </p>

              <div className="actions">

                <button
                  className="editBtn"
                  onClick={() =>
                    handleEdit(article)
                  }
                >
                  Edit
                </button>

                <button
                  className="deleteBtn"
                  onClick={() =>
                    handleDelete(article._id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

        ))}

      </div>

    </div>
  );
}

export default AddArticle;