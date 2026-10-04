export default function ResultBar({ text, votes, totalVotes }) {
  const percentage = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
        <span>{text}</span>
        <span>{percentage}% ({votes} votes)</span>
      </div>
      <div style={{ background: "#eee", borderRadius: 6, height: 14, overflow: "hidden" }}>
        <div
          style={{
            width: `${percentage}%`,
            background: "#1976d2",
            height: "100%",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
