import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { ArrowLeft, Download } from "lucide-react";

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await Axios({ ...SummaryApi.getStudentById(id) });
        if (res.data?.success) setStudent(res.data.data);
      } catch (e) {
        AxiosToastError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) return <p className="text-center p-6 text-gray-400">Loading…</p>;
  if (!student) return <p className="text-center p-6 text-red-600">Not Found</p>;

  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${student.studentId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-neutral-900 flex flex-col items-center justify-center p-6">

      {/* BACK */}
      <button
        onClick={() => navigate("/dashboard/students")}
        className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* ===== FLIP CARD ===== */}
      <div
        className={`flip-card ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flip-inner">

          {/* ---------- FRONT ---------- */}
          <div className="flip-front card">

            <div className="gold-strip" />

            <div className="card-content">
              <div className="header">
                <div>
                  <p className="college">B.N.N COLLEGE, BHIWANDI</p>
                  <p className="year">Academic Year 2025–26</p>
                </div>
                <span className="id">#{student.studentId}</span>
              </div>

              <div className="body">
                <img
                  src={student.photo || "/avatar.png"}
                  alt="student"
                  className="photo"
                />

                <div className="info">
                  <p className="name">{student.name}</p>
                  <p className="class">
                    Class {student.className} – {student.division}
                  </p>

                  <div className="grid">
                    <Row label="Roll" value={student.roll} />
                    <Row label="Mobile" value={student.mobile} />
                    <Row label="Father" value={student.fatherName} />
                    <Row label="Status" value={student.status} />
                  </div>
                </div>
              </div>

              <div className="footer">
                <img src={qrURL} className="qr" alt="QR" />
                <p>Tap card to view instructions</p>
              </div>
            </div>
          </div>

          {/* ---------- BACK ---------- */}
          <div className="flip-back card back">

            <div className="card-content back-content">
              <div>
                <p className="college">B.N.N COLLEGE, BHIWANDI</p>
                <p className="year">Academic Year 2025–26</p>
              </div>

              <ul className="instructions">
                <li>ID card must be carried daily</li>
                <li>QR scan compulsory for attendance</li>
                <li>Card is non-transferable</li>
                <li>Loss must be reported immediately</li>
                <li>Misuse may lead to disciplinary action</li>
              </ul>

              <p className="issued">
                Issued by College Authority
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* DOWNLOAD */}
      <button
        onClick={() => window.print()}
        className="mt-8 flex items-center gap-2 bg-yellow-500 text-black px-6 py-2 rounded-xl font-semibold hover:bg-yellow-400 shadow-lg"
      >
        <Download size={16} />
        Download / Print ID Card
      </button>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <span className="label">{label}:</span>{" "}
      <span className="value">{value || "-"}</span>
    </div>
  );
}
