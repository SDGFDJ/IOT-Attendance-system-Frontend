import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

export default function AttendanceScanner() {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  const [status, setStatus] = useState("");
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    let active = true;

    const startScanner = async () => {
      try {
        const reader = new BrowserQRCodeReader();
        codeReaderRef.current = reader;

        await reader.decodeFromConstraints(
          {
            video: { facingMode: { ideal: "environment" } },
          },
          videoRef.current,
          async (result) => {
            if (!active || !result || !scanning) return;

            const studentId = result.text?.trim();
            if (!studentId) return;

            setScanning(false);

            try {
              const res = await Axios({
                ...SummaryApi.scanAttendance, // ✅ FIXED
                data: { studentId },
              });

              if (res.data?.success) {
                setStatus(res.data.message || "Attendance Marked ✅");
              } else {
                setStatus(res.data?.message || "Attendance Failed ❌");
              }
            } catch (err) {
              setStatus(
                err.response?.data?.message || "Server Error ❌"
              );
            }

            setTimeout(() => {
              if (active) {
                setStatus("");
                setScanning(true);
              }
            }, 2500);
          }
        );
      } catch (err) {
        console.error("Camera Error:", err);
        setStatus("Camera permission denied ❌");
      }
    };

    startScanner();

    return () => {
      active = false;
      try {
        codeReaderRef.current?.reset();
      } catch {}
    };
  }, [scanning]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Scan QR for Attendance</h1>

      <video
        ref={videoRef}
        className="w-full max-w-sm rounded-lg border shadow-lg"
        muted
        playsInline
      />

      {status && (
        <p
          className={`mt-4 text-lg font-semibold ${
            status.includes("❌") ? "text-red-600" : "text-green-600"
          }`}
        >
          {status}
        </p>
      )}

      <p className="mt-3 text-sm text-gray-500 text-center">
        Allow camera permission when asked
      </p>
    </div>
  );
}
