import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Polls from "./pages/Polls";
import PollDetail from "./pages/PollDetail";
import NewPoll from "./pages/NewPoll";

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", background: "#1976d2", color: "white" }}>
      <Link to="/polls" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
        🗳️ Polling App
      </Link>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 12 }}>Hi, {user.name}</span>
            <button onClick={logout} style={{ background: "white", color: "#1976d2", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: "white" }}>Login</Link>
        )}
      </div>
    </nav>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p>;
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/polls" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/polls" element={<Polls />} />
        <Route path="/polls/:id" element={<PollDetail />} />
        <Route
          path="/polls/new"
          element={
            <PrivateRoute>
              <NewPoll />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
