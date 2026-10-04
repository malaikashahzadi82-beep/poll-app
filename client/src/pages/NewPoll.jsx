import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function NewPoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index, value) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index) => setOptions(options.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || cleanOptions.length < 2) {
      setError("Please provide a question and at least 2 non-empty options");
      return;
    }

    setLoading(true);
    try {
      await api.post("/polls", { question, options: cleanOptions });
      navigate("/polls");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create poll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "30px auto", padding: 16 }}>
      <h2>Create a Poll</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          style={inputStyle}
        />

        {options.map((opt, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(i, e.target.value)}
              style={{ ...inputStyle, margin: 0, flex: 1 }}
            />
            {options.length > 2 && (
              <button type="button" onClick={() => removeOption(i)} style={removeBtnStyle}>
                ✕
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addOption} style={addBtnStyle}>
          + Add option
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = { display: "block", width: "100%", padding: 10, margin: "8px 0", borderRadius: 6, border: "1px solid #ccc", boxSizing: "border-box" };
const buttonStyle = { width: "100%", padding: 10, background: "#1976d2", color: "white", border: "none", borderRadius: 6, marginTop: 12, cursor: "pointer" };
const addBtnStyle = { background: "none", border: "1px dashed #1976d2", color: "#1976d2", padding: "6px 12px", borderRadius: 6, cursor: "pointer" };
const removeBtnStyle = { background: "#eee", border: "none", borderRadius: 6, padding: "0 10px", cursor: "pointer" };
