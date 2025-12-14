import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

export default function AttendanceScanner() {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [status, setStatus] = useState("");
  const [scanning, setScanning] = useState(false);

  // 🔹 Get all cameras (mobile + usb + laptop)
  useEffect(() => {
    const getCameras = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      setCameras(videoDevices);

      // Auto select back camera if exists
      const backCam = videoDevices.find((d) =>
        d.label.toLowerCase().includes("back")
      );

      setSelectedCamera(backCam?.deviceId || videoDevices[0]?.deviceId);
    };

    getCameras();
  }, []);

  // 🔹 Start scanner with selected camera
  const startScanner = async (deviceId) => {
    try {
      setScanning(true);
      setStatus("");

      if (codeReaderRef.current) {
        codeReaderRef.current.stopContinuousDecode();
      }

      const reader = new BrowserQRCodeReader();
      codeReaderRef.current = reader;

      await reader.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        async (result) => {
          if (!result) return;

          setScanning(false);
          const studentId = result.text.trim();

          try {
            const res = await Axios({
              ...SummaryApi.markAttendance,
              data: { studentId },
            });

            setStatus(res.data.message || "Attendance Marked");
          } catch (error) {
            setStatus("Attendance Failed");
          }

          setTimeout(() => {
            setStatus("");
            setScanning(true);
          }, 3000);
        }
      );
    } catch (err) {
      console.error(err);
      setStatus("Camera error or permission denied");
    }
  };

  // 🔁 Restart scanner when camera changes
  useEffect(() => {
    if (selectedCamera) {
      startScanner(selectedCamera);
    }

    return () => {
      codeReaderRef.current?.stopContinuousDecode();
    };
  }, [selectedCamera]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-3">
        QR Attendance Scanner
      </h1>

      {/* 🎥 Camera Selector */}
      <select
        value={selectedCamera}
        onChange={(e) => setSelectedCamera(e.target.value)}
        className="mb-3 p-2 border rounded w-full max-w-sm"
      >
        {cameras.map((cam, index) => (
          <option key={cam.deviceId} value={cam.deviceId}>
            {cam.label || `Camera ${index + 1}`}
          </option>
        ))}
      </select>

      {/* 📷 Camera View */}
      <video
        ref={videoRef}
        className="w-full max-w-sm rounded-lg border shadow"
        muted
        playsInline
      />

      {/* 📢 Status */}
      {status && (
        <p className="mt-4 text-lg font-semibold text-green-600">
          {status}
        </p>
      )}

      <p className="mt-2 text-sm text-gray-500 text-center">
        You can switch camera anytime (Front / Back / USB)
      </p>
    </div>
  );
}
