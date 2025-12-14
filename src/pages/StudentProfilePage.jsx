import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { ArrowLeft, QrCode } from "lucide-react";

export default function StudentProfile() {
  const { id } = useParams(); // <-- studentId from route
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getStudentById(id),
      });

      if (response.data.success) {
        setStudent(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  if (loading) {
    return <p className="p-4 text-center">Loading student data...</p>;
  }

  if (!student) {
    return (
      <p className="p-4 text-center text-red-600">Student Not Found</p>
    );
  }

  const qrData = `ID:${student.studentId}|Name:${student.name}|Class:${student.className}`;
  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    qrData
  )}`;

  return (
    <div className="p-4 space-y-4">

      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/students")}
        className="text-sm flex items-center gap-1 border px-3 py-1 rounded"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Student Card */}
      <div className="bg-white rounded-md shadow p-4">
        <div className="flex flex-wrap gap-6">

          {/* Profile Image */}
          <img
            src={student.photo || "/avatar.png"}
            alt="Student"
            className="w-32 h-32 rounded-xl object-cover border"
          />

          {/* Info */}
          <div className="text-sm space-y-2">
            <p><strong>ID:</strong> {student.studentId}</p>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Roll:</strong> {student.roll}</p>
            <p><strong>Class:</strong> {student.className} - {student.division}</p>
            <p><strong>Mobile:</strong> {student.mobile}</p>
            <p><strong>Father Name:</strong> {student.fatherName}</p>
            <p><strong>Address:</strong> {student.address}</p>
            <p><strong>Status:</strong> {student.status}</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="mt-6 text-center">
          <QrCode size={42} className="mx-auto text-primary-200" />
          <img
            src={qrURL}
            alt="QR Code"
            className="mx-auto mt-3 border rounded p-2"
          />

          <button
            className="mt-3 px-4 py-2 border rounded hover:bg-gray-100"
            onClick={() => window.print()}
          >
            Download / Print QR
          </button>
        </div>
      </div>
    </div>
  );
}
