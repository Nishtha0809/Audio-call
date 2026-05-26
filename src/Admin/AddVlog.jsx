import React, { useEffect, useState } from "react";
import "../Styles/AddVlog.css";
import { useNavigate } from "react-router-dom";

function AddVlog() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [vlogs, setVlogs] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3002/api/vlogs")
      .then((res) => res.json())
      .then((data) => setVlogs(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATION
    if (title.trim() === "" || description.trim() === "") {
      alert("⚠️ Please add Title and Description first!");
      return;
    }

    const payload = { title, description, videoUrl, thumbnail };

    if (editId) {
      const res = await fetch(`http://localhost:3002/api/vlogs/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setVlogs(vlogs.map((v) => (v._id === editId ? data.vlog : v)));
      setEditId(null);
    } else {
      const res = await fetch("http://localhost:3002/api/vlogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setVlogs([data.vlog, ...vlogs]);
    }

    setTitle("");
    setDescription("");
    setVideoUrl("");
    setThumbnail("");
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3002/api/vlogs/${id}`, {
      method: "DELETE",
    });

    setVlogs(vlogs.filter((v) => v._id !== id));
  };

  const handleEdit = (vlog) => {
    setTitle(vlog.title);
    setDescription(vlog.description);
    setVideoUrl(vlog.videoUrl);
    setThumbnail(vlog.thumbnail);
    setEditId(vlog._id);
  };

  return (
    <div className="page">

      {/* HEADER */}
      <div className="header">
        <h1>{editId ? "Edit Vlog" : "Add Vlog"}</h1>
      </div>

      {/* FORM */}
      <div className="card">
        <h2>Vlog Form</h2>

        <form onSubmit={handleSubmit} className="form">

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            placeholder="Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          <input
            placeholder="Thumbnail URL"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
          />

          <button type="submit">
            {editId ? "Update Vlog" : "Add Vlog"}
          </button>

          {/* BACK BUTTON */}
          <button
            type="button"
            className="dashboard-btn"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Back to Dashboard
          </button>

        </form>
      </div>

      {/* LIST SECTION */}
      <div className="articles">

        {vlogs.map((vlog) => (
          <div key={vlog._id} className="articleCard">

            {/* ✅ NO EMPTY IMAGE SPACE FIX */}
            {vlog.thumbnail ? (
              <img src={vlog.thumbnail} alt="" />
            ) : (
              <div className="no-image-box">No Thumbnail</div>
            )}

            <h3>{vlog.title}</h3>

            <p>
              {vlog.description.length > 80
                ? vlog.description.substring(0, 80) + "..."
                : vlog.description}
            </p>

            <div className="actions">
              <button className="editBtn" onClick={() => handleEdit(vlog)}>
                Edit
              </button>

              <button className="deleteBtn" onClick={() => handleDelete(vlog._id)}>
                Delete
              </button>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default AddVlog;