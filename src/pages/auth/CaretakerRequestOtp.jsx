import { useState } from "react";
import { caretakerRequestOtp } from "../../api/auth";
import { useNavigate } from "react-router-dom";

export default function CaretakerRequestOtp() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRequestOtp = async () => {
    try {
      const res = await caretakerRequestOtp({ email, fullName });
      navigate("/auth/caretaker-verify", { state: { email } });
    } catch (err) {
      setError("Failed to send OTP. Try again.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Caretaker Login
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          className="inputField"
          placeholder="Full Name (optional)"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="email"
          className="inputField"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleRequestOtp} className="primaryBtn">
          Send OTP
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Back to{" "}
          <span
            onClick={() => navigate("/auth/login")}
            className="text-blue-600 cursor-pointer font-semibold"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
