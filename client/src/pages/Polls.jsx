import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import PollCard from "../components/PollCard";

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPolls = async () => {
    setLoading(true);
    const res = await api.get("/polls");
    setPolls(res.data.polls);
    setLoading(false);
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleUpdate = (updated) => {
    setPolls((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  return (
    <div style={{ maxWidth: 650, margin: "20px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>All Polls</h2>
        <Link to="/polls/new" style={{ background: "#1976d2", color: "white", padding: "8px 14px", borderRadius: 6, textDecoration: "none" }}>
          + New Poll
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : polls.length === 0 ? (
        <p>No polls yet. Be the first to create one.</p>
      ) : (
        polls.map((p) => <PollCard key={p._id} poll={p} onUpdate={handleUpdate} />)
      )}
    </div>
  );
}
