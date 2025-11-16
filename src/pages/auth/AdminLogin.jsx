import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { useAuth } from "../../components/AuthProvider";


const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await login({ email, password });
      if (res.success) {
        const u = {
          fullName: res.data.fullName,
          email: res.data.email,
          role: res.data.role,
        };
        setUser(u);
        // redirect based on role
        navigate("/", { replace: true });
      } else {
        setErr(res.message || "Login failed");
      }
    } catch (ex) {
      setErr(ex?.response?.data?.message || "Login error");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "2rem auto" }}>
      <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
      <h2>Patient Login</h2>
      <form onSubmit={submit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        </div>
        {err && <div style={{ color: "red" }}>{err}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
