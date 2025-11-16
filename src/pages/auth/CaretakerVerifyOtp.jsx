import { useState } from "react";
import { caretakerVerifyOtp } from "../../api/auth";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import { useLocation, useNavigate } from "react-router-dom";

export default function CaretakerVerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = location.state?.email;

  if (!email) {
    navigate("/auth/caretaker-request");
  }

  const handleVerify = async () => {
    try {
      const res = await caretakerVerifyOtp({ email, otp });

      if (res.status && res.status !== "Approved") {
        setError(`Your account is ${res.status}. Wait for Admin approval.`);
        return;
      }

      dispatch(
        loginSuccess({
          fullName: res.fullName || "Caretaker",
          email: email,
          role: "Caretaker",
        })
      );

      navigate("/caretakerDashboard");
    } catch (err) {
      setError("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Verify OTP
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <p className="text-gray-600 text-sm mb-4">
          Enter the OTP sent to: <strong>{email}</strong>
        </p>

        <input
          className="inputField"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={handleVerify} className="primaryBtn">
          Verify OTP
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Wrong email?{" "}
          <span
            className="text-blue-600 cursor-pointer font-semibold"
            onClick={() => navigate("/auth/caretaker-request")}
          >
            Go back
          </span>
        </p>
      </div>
    </div>
  );
}
