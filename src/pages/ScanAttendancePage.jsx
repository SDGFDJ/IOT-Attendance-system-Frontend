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
    let isMounted = true;

    const startScanner = async () => {
      try {
        const codeReader = new BrowserQRCodeReader();
        codeReaderRef.current = codeReader;

        await codeReader.decodeFromConstraints(
          {
            video: { facingMode: { ideal: "environment" } }, // mobile back / desktop auto
          },
          videoRef.current,
          async (result) => {
            if (!result || !scanning || !isMounted) return;

            const studentId = result.text?.trim();
            if (!studentId) return;

            setScanning(false);

            try {
              const res = await Axios({
                ...SummaryApi.markAttendance,
                data: { studentId },
              });

              // ✅ IMPORTANT FIX
              if (res.data?.success) {
                setStatus(res.data.message || "Attendance Marked");
              } else {
                setStatus(res.data?.message || "Attendance Failed");
              }
            } catch (error) {
              console.error("Attendance API Error:", error.response?.data || error);
              setStatus(
                error.response?.data?.message || "Attendance Failed"
              );
            }

            setTimeout(() => {
              if (isMounted) {
                setStatus("");
                setScanning(true);
              }
            }, 3000);
          }
        );
      } catch (error) {
        console.error("Camera Error:", error);
        setStatus("Camera permission denied");
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      try {
        codeReaderRef.current?.stopContinuousDecode();
      } catch (e) {}
    };
  }, []);

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
            status.toLowerCase().includes("fail")
              ? "text-red-600"
              : "text-green-600"
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
