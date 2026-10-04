import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import PollCard from "../components/PollCard";

export default function PollDetail() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/polls/${id}`).then((res) => {
      setPoll(res.data.poll);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p>;
  if (!poll) return <p style={{ textAlign: "center", marginTop: 40 }}>Poll not found.</p>;

  return (
    <div style={{ maxWidth: 650, margin: "20px auto", padding: 16 }}>
      <Link to="/polls" style={{ color: "#1976d2" }}>&larr; Back to all polls</Link>
      <div style={{ marginTop: 16 }}>
        <PollCard poll={poll} onUpdate={setPoll} />
      </div>
    </div>
  );
}
