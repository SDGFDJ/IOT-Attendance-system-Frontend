import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Plus, Search, RefreshCw, ArrowUpDown, Trash, CalendarDays } from "lucide-react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";

export default function StudentsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [classFilter, setClassFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(1);
  const limit = 10;

  // 🔹 Fetch All Students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.getStudents,
        url: "/api/user/students",
      });

      if (response.data.success) setStudents(response.data.data);
    } catch (error) {
      AxiosToastError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 🔍 Search + Filter + Sorting
  const filteredStudents = students
    .filter((s) => {
      const query = search.toLowerCase();
      return (
        s.name?.toLowerCase().includes(query) ||
        s.studentId?.toLowerCase().includes(query) ||
        s.roll?.toLowerCase().includes(query) ||
        s.className?.toLowerCase().includes(query)
      );
    })
    .filter((s) => (classFilter ? s.className === classFilter : true))
    .filter((s) => (divisionFilter ? s.division === divisionFilter : true));

  if (sortField) {
    filteredStudents.sort((a, b) => {
      const x = a[sortField]?.toLowerCase();
      const y = b[sortField]?.toLowerCase();
      if (x < y) return sortOrder === "asc" ? -1 : 1;
      if (x > y) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredStudents.length / limit);
  const paginatedData = filteredStudents.slice((page - 1) * limit, page * limit);

  const toggleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // ❌ Delete Student
  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure to delete this student?")) return;

    try {
const response = await Axios(SummaryApi.deleteStudent(studentId));



      if (response.data.success) {
        alert("Student Deleted Successfully ❌");
        fetchStudents();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-primary-200">Students Database</h2>

        <div className="flex gap-3">
          <button
            onClick={fetchStudents}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md flex items-center gap-2"
          >
            <RefreshCw size={18} />
          </button>
<button
  onClick={() => navigate("/dashboard/attendance-scan")}
  className="bg-green-600 text-white px-4 py-2 rounded-md"
>
  Scan QR Attendance
</button>

          <button
            onClick={() => navigate("/dashboard/add-student")}
            className="bg-primary-200 hover:bg-primary-100 px-4 py-2 text-white font-semibold rounded-md flex items-center gap-2"
          >
            <Plus size={18} /> Add Student
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 text-sm">
        <div className="flex bg-blue-50 border rounded px-3 py-2 w-full items-center">
          <Search size={18} className="text-gray-600" />
          <input
            type="text"
            placeholder="Search by Name / ID / Roll / Class..."
            className="outline-none bg-transparent ml-2 w-full"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        <select
          className="border rounded px-2"
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="">Class</option>
          {[...new Set(students.map((s) => s.className))].map((cls, i) => (
            <option key={i} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-2"
          onChange={(e) => setDivisionFilter(e.target.value)}
        >
          <option value="">Division</option>
          {[...new Set(students.map((s) => s.division))].map((d, i) => (
            <option key={i} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-50 border-b text-gray-900">
              {[
                { label: "ID", field: "studentId" },
                { label: "Name", field: "name" },
                { label: "Roll", field: "roll" },
                { label: "Class", field: "className" },
              ].map((col) => (
                <th
                  key={col.field}
                  className="px-3 py-3 font-medium cursor-pointer select-none"
                  onClick={() => toggleSort(col.field)}
                >
                  <span className="flex items-center gap-1">
                    {col.label} <ArrowUpDown size={14} />
                  </span>
                </th>
              ))}
              <th className="px-3 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              paginatedData.map((s) => (
                <tr key={s._id} className="border-b hover:bg-blue-50">
                  <td
                    className="px-3 py-2 cursor-pointer"
                    onClick={() => navigate(`/dashboard/student/${s.studentId}`)}
                  >
                    {s.studentId}
                  </td>

                  <td
                    className="px-3 py-2 cursor-pointer"
                    onClick={() => navigate(`/dashboard/student/${s.studentId}`)}
                  >
                    {s.name}
                  </td>

                  <td className="px-3 py-2">{s.roll}</td>
                  <td className="px-3 py-2">
                    {s.className}-{s.division}
                  </td>

<td className="px-3 py-2 flex justify-center gap-4">

  {/* View Profile */}
  <button
    className="text-blue-600 hover:underline"
    onClick={() =>
      navigate(`/dashboard/student/${s.studentId}`)
    }
  >
    View
  </button>

  {/* Attendance Calendar Button */}
  <button
    className="text-green-600 hover:underline"
    onClick={() =>
      navigate(`/dashboard/student/${s.studentId}/attendance`)
    }
  >
    <CalendarDays size={20} />
  </button>

  {/* Delete Button */}
  <button
    className="text-red-600 hover:underline"
    onClick={() => handleDelete(s.studentId)}
  >
    <Trash size={20} />
  </button>
</td>

                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center py-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <span
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border cursor-pointer select-none ${
              page === i + 1
                ? "bg-primary-200 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}
