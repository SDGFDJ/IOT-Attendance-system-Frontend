import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

export default function AttendanceScanner() {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const lastScannedRef = useRef(null);

  const [status, setStatus] = useState("");

  useEffect(() => {
    let isActive = true;

    const startScanner = async () => {
      try {
        const reader = new BrowserQRCodeReader();
        readerRef.current = reader;

        await reader.decodeFromConstraints(
          {
            video: { facingMode: { ideal: "environment" } },
          },
          videoRef.current,
          async (result) => {
            if (!isActive || !result) return;

            const studentId = result.text?.trim();
            if (!studentId) return;

            // 🚫 Prevent duplicate scan of same QR
            if (lastScannedRef.current === studentId) return;
            lastScannedRef.current = studentId;

            try {
              const res = await Axios({
                ...SummaryApi.scanAttendance,
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

            // 🔁 Allow re-scan after 2 sec
            setTimeout(() => {
              lastScannedRef.current = null;
              setStatus("");
            }, 2000);
          }
        );
      } catch (err) {
        console.error("Camera Error:", err);
        setStatus("Camera permission denied ❌");
      }
    };

    startScanner();

    return () => {
      isActive = false;
      try {
        readerRef.current?.reset();
      } catch {}
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">
        Continuous QR Attendance Scan
      </h1>

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
      Scanner is running continuously — no refresh needed
      </p>
    </div>
  );
}
