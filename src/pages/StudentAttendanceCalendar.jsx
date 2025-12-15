import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const TOTAL_LECTURES_PER_DAY = 6;

export default function StudentAttendanceCalendar() {
  const { id: studentId } = useParams();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth()); // 0-based
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  /* 🔒 TODAY – single source of truth */
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await Axios(
        SummaryApi.getStudentAttendanceMonth(
          studentId,
          month + 1,
          year
        )
      );

      setAttendance(res.data?.success ? res.data.data : []);
    } catch (e) {
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  /* 📅 Calendar math */
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  /* 🧠 Month level future check */
  const isFutureMonth =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth());

  /* 🎨 FINAL STATUS LOGIC (BULLETPROOF) */
  const getStatusStyle = (day) => {
    const record = attendance.find((d) => d.day === day);
    const dateObj = new Date(year, month, day);
    dateObj.setHours(0, 0, 0, 0);

    const isSunday = dateObj.getDay() === 0;

    // 🩶 Sunday
    if (isSunday) {
      return "bg-gray-300 text-gray-600";
    }

    // ⚪ Future month
    if (isFutureMonth) {
      return "bg-slate-200 text-slate-500";
    }

    // ⚪ Current month but future day
    if (dateObj > today) {
      return "bg-slate-200 text-slate-500";
    }

    // 🔴 Past / Today – no attendance
    if (!record || record.lectures === 0) {
      return "bg-red-500 text-white";
    }

    // 🟡 Low (1–2)
    if (record.lectures <= 2) {
      return "bg-yellow-200 text-yellow-800";
    }

    // 🟠 Partial (3–5)
    if (record.lectures < TOTAL_LECTURES_PER_DAY) {
      return "bg-orange-400 text-white";
    }

    // 🟢 Full
    return "bg-green-500 text-white";
  };

  /* 🚫 Click control */
  const handleDayClick = (day) => {
    const dateObj = new Date(year, month, day);
    dateObj.setHours(0, 0, 0, 0);

    if (
      isFutureMonth ||
      dateObj > today ||
      dateObj.getDay() === 0
    ) {
      return;
    }

    navigate(
      `/dashboard/attendance/details/${studentId}?day=${day}&month=${month + 1}&year=${year}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4">

      {/* 🔙 Back */}
      <button
        className="mb-3 px-3 py-2 rounded-lg border bg-white shadow flex items-center gap-2 text-sm"
        onClick={() => navigate("/dashboard/students")}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* 📅 Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setMonth(m => (m === 0 ? 11 : m - 1))}
          className="p-2 rounded-full bg-white shadow"
        >
          <ChevronLeft />
        </button>

        <h2 className="font-bold text-base sm:text-lg flex items-center gap-2">
          <Calendar size={18} />
          {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
        </h2>

        <button
          onClick={() => setMonth(m => (m === 11 ? 0 : m + 1))}
          className="p-2 rounded-full bg-white shadow"
        >
          <ChevronRight />
        </button>
      </div>

      {/* 📆 Calendar */}
      {!loading && (
        <>
          <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-semibold mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {[...Array(startDay)].map((_, i) => (
              <div key={i}></div>
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={`h-10 sm:h-12 flex items-center justify-center rounded-lg text-xs sm:text-sm font-semibold ${getStatusStyle(day)}`}
              >
                {day}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
