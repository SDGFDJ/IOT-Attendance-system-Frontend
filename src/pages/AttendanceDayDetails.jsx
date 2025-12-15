import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

export default function AttendanceDayDetails() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const day = params.get("day");
  const month = params.get("month");
  const year = params.get("year");

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
const fetchDayAttendance = async () => {
  try {
    setLoading(true);

    const res = await Axios(
      SummaryApi.getStudentAttendanceDay(id, day, month, year)
    );

    if (res.data?.success) {
      setRecords(res.data.data);
    } else {
      setRecords([]);
    }
  } catch (error) {
    console.error("Day Attendance Error:", error);
    setRecords([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (id && day && month && year) {
      fetchDayAttendance();
    }
  }, [id, day, month, year]);

  return (
    <div className="p-4">
      {/* 🔙 Back */}
      <button
        className="mb-4 px-4 py-2 border rounded flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <h2 className="text-lg font-bold mb-4">
        Attendance – {day}/{month}/{year}
      </h2>

      {/* ⏳ Loading */}
      {loading && <p className="text-gray-500">Loading attendance...</p>}

      {/* 📋 Records */}
      {!loading && records.length > 0 && (
        <div className="space-y-2">
          {records.map((rec, index) => (
            <div
              key={index}
              className={`p-3 rounded-md text-white ${
                rec.status === "Present" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              Lecture <b>{rec.lecture}</b> : {rec.status}
            </div>
          ))}
        </div>
      )}

      {/* ❌ No Data */}
      {!loading && records.length === 0 && (
        <p className="text-red-600 font-medium">
          ❌ No attendance recorded
        </p>
      )}
    </div>
  );
}
