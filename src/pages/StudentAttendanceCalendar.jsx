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

  /* 📡 Fetch attendance */
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

  /* ============================================================
     🧠 NORMALIZE BACKEND DATA (🔥 MOST IMPORTANT FIX)
     Works with:
     { day, lectures }
     { _id: { day }, lectures }
     { date }
  ============================================================ */
  const attendanceMap = useMemo(() => {
    const map = {};

    attendance.forEach(item => {
      const day =
        item.day ??
        item._id?.day ??
        (item.date ? new Date(item.date).getDate() : null);

      if (day != null) {
        map[Number(day)] = item.lectures ?? 0;
      }
    });

    return map;
  }, [attendance]);

  /* 📅 Calendar math */
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  /* ============================================================
     🎨 FINAL STATUS STYLE (BULLETPROOF)
  ============================================================ */
  const getStatusStyle = (day) => {
    const lectures = attendanceMap[day] || 0;

    const dateObj = new Date(year, month, day);
    dateObj.setHours(0, 0, 0, 0);

    const isSunday = dateObj.getDay() === 0;

    // 🩶 Sunday
    if (isSunday) {
      return "bg-gray-300 text-gray-600 cursor-not-allowed";
    }

    // ⚪ Future date (NO RED, NO GREEN)
    if (dateObj > today) {
      return "bg-slate-200 text-slate-500 cursor-not-allowed";
    }

    // 🟢 At least 1 lecture present
    if (lectures > 0) {
      return "bg-green-500 text-white hover:opacity-90";
    }

    // 🔴 Past / Today but NO attendance
    return "bg-red-500 text-white hover:opacity-90";
  };

  /* 🚫 Click control */
  const handleDayClick = (day) => {
    const dateObj = new Date(year, month, day);
    dateObj.setHours(0, 0, 0, 0);

    if (dateObj > today || dateObj.getDay() === 0) return;

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
          onClick={() => {
            if (month === 0) {
              setMonth(11);
              setYear(y => y - 1);
            } else {
              setMonth(m => m - 1);
            }
          }}
          className="p-2 rounded-full bg-white shadow"
        >
          <ChevronLeft />
        </button>

        <h2 className="font-bold text-base sm:text-lg flex items-center gap-2">
          <Calendar size={18} />
          {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
        </h2>

        <button
          onClick={() => {
            if (month === 11) {
              setMonth(0);
              setYear(y => y + 1);
            } else {
              setMonth(m => m + 1);
            }
          }}
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
