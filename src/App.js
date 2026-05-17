// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = process.env.REACT_APP_API_URL;

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", age: "", course: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/students`);
      setStudents(res.data);
    } catch {
      setError("Failed to load students");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        await axios.put(`${API}/students/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post(`${API}/students`, form);
      }
      setForm({ name: "", email: "", age: "", course: "" });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleEdit = (student) => {
    setEditId(student.id);
    setForm({
      name: student.name,
      email: student.email,
      age: student.age,
      course: student.course,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`${API}/students/${id}`);
      fetchStudents();
    } catch {
      setError("Failed to delete student");
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ name: "", email: "", age: "", course: "" });
    setError("");
  };

  return (
    <div className="app">
      <header>
        <h1>🎓 Student Records</h1>
        <p>Manage student information easily</p>
      </header>

      <div className="container">
        {/* Form */}
        <div className="card form-card">
          <h2>{editId ? "Edit Student" : "Add New Student"}</h2>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                name="name"
                placeholder="Full Name *"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                name="age"
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                min="1"
                max="100"
              />
              <input
                name="course"
                placeholder="Course"
                value={form.course}
                onChange={handleChange}
              />
            </div>
            <div className="btn-row">
              <button type="submit" className="btn primary">
                {editId ? "Update Student" : "Add Student"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="card">
          <h2>All Students ({students.length})</h2>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : students.length === 0 ? (
            <p className="empty">No students yet. Add one above!</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Course</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.id} className={editId === s.id ? "editing" : ""}>
                      <td>{i + 1}</td>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.age || "—"}</td>
                      <td>{s.course || "—"}</td>
                      <td>
                        <button
                          className="btn-sm edit"
                          onClick={() => handleEdit(s)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-sm delete"
                          onClick={() => handleDelete(s.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;