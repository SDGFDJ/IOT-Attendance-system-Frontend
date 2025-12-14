import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentAttendanceCalendar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchAttendance = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.getStudentAttendanceMonth,
        url: `/api/attendance/by-month/${id}?month=${month + 1}&year=${year}`,
      });

      if (res.data.success) setAttendance(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  // Calendar logic
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const getStatusColor = (day) => {
    const record = attendance.find((d) => d.day === day);
    if (!record) return "bg-red-400"; // Absent

    if (record.lectures >= 4) return "bg-green-500"; // Fully

    return "bg-orange-400"; // Partial
  };

  const isSunday = (day) =>
    new Date(year, month, day).getDay() === 0 ? "bg-red-600 text-white" : "";

  return (
    <div className="p-4">
      <button
        className="mb-4 px-4 py-2 border rounded-md flex items-center gap-2"
        onClick={() => navigate("/dashboard/students")}
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => {
            if (month === 5) return; // June min
            setMonth(month - 1);
          }}
        >
          ◀
        </button>

        <h2 className="font-bold text-lg flex items-center gap-2">
          <Calendar size={22} />
          {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
        </h2>

        <button
          onClick={() => {
            if (month === 3) return; // April max
            setMonth(month + 1);
          }}
        >
          ▶
        </button>
      </div>

      {/* Calendar UI */}
      <div className="grid grid-cols-7 text-center font-semibold mb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {[...Array(startDay)].map((_, i) => (
          <div key={i}></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <div
            key={day}
            className={`h-12 flex items-center justify-center rounded-md cursor-pointer text-white ${getStatusColor(day)} ${isSunday(day)}`}
            onClick={() =>
              navigate(`/dashboard/attendance/details/${id}?day=${day}&month=${month + 1}&year=${year}`)
            }
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
