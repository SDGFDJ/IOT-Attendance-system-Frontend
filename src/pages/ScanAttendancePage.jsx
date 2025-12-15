import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

export default function AttendanceScanner() {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const scanningRef = useRef(true);

  const [status, setStatus] = useState("Align QR inside the box");

  /* ===============================
     🔹 STAGE 1: CAMERA + QR DETECT
  ================================ */
  useEffect(() => {
    const reader = new BrowserQRCodeReader(undefined, {
      delayBetweenScanAttempts: 80, // ⚡ fast but stable
    });
    readerRef.current = reader;

    const startScanner = async () => {
      try {
        await reader.decodeFromVideoDevice(
          null, // auto-select back camera
          videoRef.current,
          (result) => {
            if (!scanningRef.current) return;

            if (result?.text) {
              scanningRef.current = false; // 🔒 lock scanner
              handleAttendance(result.text.trim());
            }
          }
        );
      } catch (err) {
        console.error(err);
        setStatus("Camera error ❌");
      }
    };

    startScanner();

    /* ===============================
       🔹 CLEANUP (VERY IMPORTANT)
    ================================ */
    return () => {
      scanningRef.current = false;
      try {
        readerRef.current?.stopContinuousDecode();
      } catch {}
    };
  }, []);

  /* ===============================
     🔹 STAGE 2: API PROCESSING
  ================================ */
  const handleAttendance = async (studentId) => {
    setStatus("Processing attendance…");

    try {
      const res = await Axios({
        ...SummaryApi.markAttendance,
        data: { studentId },
      });

      setStatus(
        res.data?.success
          ? res.data.message || "Attendance marked ✅"
          : res.data?.message || "Attendance failed ❌"
      );
    } catch {
      setStatus("Server error ❌");
    }

    // 🔁 Resume scanning after delay
    setTimeout(() => {
      scanningRef.current = true;
      setStatus("Align QR inside the box");
    }, 2000);
  };

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center overflow-hidden">

      {/* HEADER */}
      <h1 className="text-white mb-2 font-semibold text-lg">
        QR Attendance Scanner
      </h1>

      {/* CAMERA VIEW */}
      <div className="relative w-full max-w-sm aspect-[3/4] rounded-xl overflow-hidden shadow-xl">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40" />

        {/* SCAN BOX */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-56 h-56 border-2 border-green-400 rounded-xl overflow-hidden">
            <div className="scan-line" />
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />
          </div>
        </div>
      </div>

      {/* STATUS */}
      <p className="mt-3 text-sm font-semibold text-green-400">
        {status}
      </p>
    </div>
  );
}
