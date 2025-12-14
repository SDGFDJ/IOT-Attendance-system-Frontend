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
    const startScanner = async () => {
      try {
        const codeReader = new BrowserQRCodeReader();
        codeReaderRef.current = codeReader;

        // 🔥 Auto open BACK camera
        await codeReader.decodeFromConstraints(
          {
            video: {
              facingMode: { ideal: "environment" }, // back camera
            },
          },
          videoRef.current,
          async (result, err) => {
            if (!result || !scanning) return;

            const studentId = result.text.trim();
            setScanning(false); // prevent double scan

            try {
              const res = await Axios({
                ...SummaryApi.markAttendance,
                data: { studentId },
              });

              setStatus(res.data.message || "Attendance Marked ✅");
            } catch (error) {
              setStatus("❌ Attendance Failed");
              console.error(error);
            }

            // 🔁 Resume scanning after 3 sec
            setTimeout(() => {
              setStatus("");
              setScanning(true);
            }, 3000);
          }
        );
      } catch (error) {
        console.error("Camera Error:", error);
        setStatus("Camera permission denied ❌");
      }
    };

    startScanner();

    return () => {
      codeReaderRef.current?.reset();
    };
  }, [scanning]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">📷 Scan QR for Attendance</h1>

      <video
        ref={videoRef}
        className="w-full max-w-sm rounded-lg border shadow-lg"
        muted
        playsInline
      />

      {status && (
        <p className="mt-4 text-lg font-semibold text-green-600">
          {status}
        </p>
      )}

      <p className="mt-3 text-sm text-gray-500">
        Camera will scan automatically
      </p>
    </div>
  );
}
