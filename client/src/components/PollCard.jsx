import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import ResultBar from "./ResultBar";

export default function PollCard({ poll, onUpdate }) {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const hasVoted = user && poll.votedUsers?.some((id) => id === user._id || id?._id === user._id);
  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

  const handleVote = async (optionId) => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post(`/polls/${poll._id}/vote`, { optionId });
      onUpdate?.(res.data.poll);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to vote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 16,
        marginBottom: 14,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ margin: "0 0 10px" }}>
        <Link to={`/polls/${poll._id}`} style={{ color: "#1976d2", textDecoration: "none" }}>
          {poll.question}
        </Link>
      </h3>

      {error && <p style={{ color: "red", fontSize: 13 }}>{error}</p>}

      {hasVoted || !user ? (
        <>
          {poll.options.map((opt) => (
            <ResultBar key={opt._id} text={opt.text} votes={opt.votes} totalVotes={totalVotes} />
          ))}
          {!user && <p style={{ fontSize: 13, color: "#999" }}>Login to vote.</p>}
          {hasVoted && <p style={{ fontSize: 13, color: "#388e3c" }}>You already voted ✓</p>}
        </>
      ) : (
        poll.options.map((opt) => (
          <button
            key={opt._id}
            onClick={() => handleVote(opt._id)}
            disabled={loading}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "8px 12px",
              margin: "6px 0",
              borderRadius: 6,
              border: "1px solid #1976d2",
              background: "white",
              color: "#1976d2",
              cursor: "pointer",
            }}
          >
            {opt.text}
          </button>
        ))
      )}

      <p style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
        {totalVotes} total vote{totalVotes !== 1 ? "s" : ""} · by {poll.createdBy?.name || "unknown"}
      </p>
    </div>
  );
}
