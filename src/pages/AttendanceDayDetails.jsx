import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle,
  XCircle,
  CalendarDays,
  TrendingUp
} from "lucide-react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const TOTAL_LECTURES_PER_DAY = 6;

export default function AttendanceDayDetails() {
  const { id: studentId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const day = Number(params.get("day"));
  const month = Number(params.get("month"));
  const year = Number(params.get("year"));

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDayAttendance = useCallback(async () => {
    if (!studentId || !day || !month || !year) return;

    try {
      setLoading(true);

      const res = await Axios(
        SummaryApi.getStudentAttendanceDay(studentId, day, month, year)
      );

      if (res.data?.success && Array.isArray(res.data.data)) {
        setRecords(
          res.data.data.sort((a, b) => a.lectureNo - b.lectureNo)
        );
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error("Day attendance error:", error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [studentId, day, month, year]);

  useEffect(() => {
    fetchDayAttendance();
  }, [fetchDayAttendance]);

  // ✅ REAL CALCULATIONS
  const presentCount = records.length;
  const absentCount = TOTAL_LECTURES_PER_DAY - presentCount;
  const attendancePercent = Math.round(
    (presentCount / TOTAL_LECTURES_PER_DAY) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">

      {/* 🔝 HEADER */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white shadow hover:scale-105 transition"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">
              Attendance Overview
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays size={14} />
              {day}/{month}/{year}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">

        {/* 📊 REAL DAY SUMMARY */}
        {!loading && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow">
              <p className="text-sm text-gray-500">Total Lectures</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {TOTAL_LECTURES_PER_DAY}
              </h3>
            </div>

            <div className="bg-green-100 rounded-2xl p-4 shadow">
              <p className="text-sm text-green-700">Present</p>
              <h3 className="text-2xl font-bold text-green-700">
                {presentCount}
              </h3>
            </div>

            <div className="bg-red-100 rounded-2xl p-4 shadow">
              <p className="text-sm text-red-700">Absent</p>
              <h3 className="text-2xl font-bold text-red-700">
                {absentCount}
              </h3>
            </div>
          </div>
        )}

        {/* 📈 ATTENDANCE % */}
        {!loading && (
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-4 shadow">
            <p className="text-sm opacity-90">Attendance Percentage</p>
            <h3 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp size={20} />
              {attendancePercent}%
            </h3>
          </div>
        )}

        {/* ⏳ LOADING */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        )}

        {/* ❌ NO DATA */}
        {!loading && records.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow">
            <XCircle className="mx-auto text-red-500 mb-3" size={36} />
            <p className="font-semibold text-gray-700">
              No attendance recorded
            </p>
          </div>
        )}

        {/* 📚 LECTURE CARDS */}
        {!loading && records.length > 0 && (
          <div className="grid gap-4">
            {records.map(rec => (
              <div
                key={rec._id}
                className="relative overflow-hidden bg-white rounded-2xl p-5 shadow hover:shadow-xl transition"
              >
                <div className="absolute top-0 left-0 h-full w-1 bg-green-500" />

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <BookOpen size={18} />
                      {rec.subject}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Lecture {rec.lectureNo}
                    </p>
                  </div>

                  <span className="px-3 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">
                    Present
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} />
                  {rec.startTime} – {rec.endTime}
                </div>

                <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle size={16} />
                  Attended
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
