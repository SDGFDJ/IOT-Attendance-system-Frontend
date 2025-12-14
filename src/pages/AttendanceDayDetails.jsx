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

  const fetchDayAttendance = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.getStudentAttendanceDay,
        url: `/api/attendance/day/${id}?day=${day}&month=${month}&year=${year}`,
      });

      if (res.data.success) setRecords(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDayAttendance();
  }, []);

  return (
    <div className="p-4">
      <button
        className="mb-4 px-4 py-2 border rounded flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <h2 className="text-lg font-bold mb-3">
        Attendance - {day}/{month}/{year}
      </h2>

      <div className="space-y-2">
        {records.length > 0 ? (
          records.map((rec, index) => (
            <div
              key={index}
              className={`p-3 rounded-md text-white ${
                rec.status === "Present" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              Lecture {rec.lecture}: {rec.status}
            </div>
          ))
        ) : (
          <p className="text-red-600 font-medium">
            ❌ No attendance recorded
          </p>
        )}
      </div>
    </div>
  );
}
