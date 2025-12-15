import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  ArrowUpDown,
  Trash,
  CalendarDays,
  Eye,
} from "lucide-react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";

export default function StudentsPage() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [classFilter, setClassFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(1);
  const limit = 10;

  /* ================= FETCH ================= */
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await Axios(SummaryApi.getStudents);
      if (res.data?.success) setStudents(res.data.data || []);
    } catch (e) {
      AxiosToastError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ================= FILTER ================= */
  const filteredStudents = students
    .filter((s) => {
      const q = search.toLowerCase();
      return (
        s.name?.toLowerCase().includes(q) ||
        s.studentId?.toLowerCase().includes(q) ||
        s.roll?.toLowerCase().includes(q) ||
        s.className?.toLowerCase().includes(q)
      );
    })
    .filter((s) => (classFilter ? s.className === classFilter : true))
    .filter((s) => (divisionFilter ? s.division === divisionFilter : true));

  if (sortField) {
    filteredStudents.sort((a, b) => {
      const x = a[sortField]?.toString().toLowerCase();
      const y = b[sortField]?.toString().toLowerCase();
      if (x < y) return sortOrder === "asc" ? -1 : 1;
      if (x > y) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredStudents.length / limit);
  const paginatedData = filteredStudents.slice(
    (page - 1) * limit,
    page * limit
  );

  const toggleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await Axios(SummaryApi.deleteStudent(id));
      fetchStudents();
    } catch (e) {
      AxiosToastError(e);
    }
  };

  return (
    <div className="p-3 sm:p-4 max-w-full overflow-x-hidden">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-primary-200">
          Students Database
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchStudents}
            className="bg-gray-200 px-3 py-2 rounded-md"
          >
            <RefreshCw size={18} />
          </button>

          <button
            onClick={() => navigate("/dashboard/attendance-scan")}
            className="bg-green-600 text-white px-3 py-2 rounded-md text-sm"
          >
            Scan QR
          </button>

          <button
            onClick={() => navigate("/dashboard/add-student")}
            className="bg-primary-200 text-white px-3 py-2 rounded-md text-sm flex items-center gap-1"
          >
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="flex items-center border rounded px-3 py-2 w-full">
          <Search size={16} />
          <input
            className="ml-2 w-full outline-none text-sm"
            placeholder="Search by name / ID / roll / class"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          className="border rounded px-2 py-2 text-sm"
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="">Class</option>
          {[...new Set(students.map((s) => s.className))].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          className="border rounded px-2 py-2 text-sm"
          onChange={(e) => setDivisionFilter(e.target.value)}
        >
          <option value="">Division</option>
          {[...new Set(students.map((s) => s.division))].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="space-y-3 sm:hidden">
        {!loading &&
          paginatedData.map((s) => (
            <div key={s._id} className="bg-white border rounded-xl p-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/dashboard/student/${s.studentId}`)
                  }
                >
                  <p className="font-semibold text-sm text-blue-600">
                    {s.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {s.studentId}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Eye
                    size={18}
                    className="text-blue-600 cursor-pointer"
                    onClick={() =>
                      navigate(`/dashboard/student/${s.studentId}`)
                    }
                  />
                  <CalendarDays
                    size={18}
                    className="text-green-600 cursor-pointer"
                    onClick={() =>
                      navigate(`/dashboard/student/${s.studentId}/attendance`)
                    }
                  />
                  <Trash
                    size={18}
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleDelete(s.studentId)}
                  />
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-600 flex justify-between">
                <span>Roll: {s.roll}</span>
                <span>
                  {s.className}-{s.division}
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block border rounded-md overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-blue-50">
            <tr>
              {[
                { label: "ID", field: "studentId" },
                { label: "Name", field: "name" },
                { label: "Roll", field: "roll" },
                { label: "Class", field: "className" },
              ].map((c) => (
                <th
                  key={c.field}
                  onClick={() => toggleSort(c.field)}
                  className="px-3 py-2 cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    {c.label} <ArrowUpDown size={12} />
                  </div>
                </th>
              ))}
              <th className="px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {!loading &&
              paginatedData.map((s) => (
                <tr key={s._id} className="border-b hover:bg-blue-50">
                  <td className="px-3 py-2 text-blue-600 cursor-pointer"
                    onClick={() =>
                      navigate(`/dashboard/student/${s.studentId}`)
                    }
                  >
                    {s.studentId}
                  </td>
                  <td className="px-3 py-2">{s.name}</td>
                  <td className="px-3 py-2">{s.roll}</td>
                  <td className="px-3 py-2">
                    {s.className}-{s.division}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center gap-4">
                      <Eye
                        size={18}
                        className="text-blue-600 cursor-pointer"
                        onClick={() =>
                          navigate(`/dashboard/student/${s.studentId}`)
                        }
                      />
                      <CalendarDays
                        size={18}
                        className="text-green-600 cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/dashboard/student/${s.studentId}/attendance`
                          )
                        }
                      />
                      <Trash
                        size={18}
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDelete(s.studentId)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center flex-wrap gap-2 py-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded text-sm ${
              page === i + 1
                ? "bg-primary-200 text-white"
                : "bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
