import React, { useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddStudent() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    roll: "",
    className: "",
    division: "",
    fatherName: "",
    mobile: "",
    address: "",
  });

  const [photo, setPhoto] = useState(null);
  const [qrURL, setQrURL] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v));
      if (photo) formData.append("photo", photo);

      const res = await Axios({
        ...SummaryApi.addStudent,
        data: formData,
      });

      if (res.data?.success) {
        const id = res.data.data.studentId;
        setStudentId(id);

        const qrData = `ID:${id}|Name:${data.name}|Roll:${data.roll}`;
        setQrURL(
          `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
            qrData
          )}`
        );

        toast.success("Student added successfully");
        setTimeout(() => navigate("/dashboard/students"), 1200);

        setData({
          name: "",
          roll: "",
          className: "",
          division: "",
          fatherName: "",
          mobile: "",
          address: "",
        });
        setPhoto(null);
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center p-3 md:p-6">

      {/* MAIN CARD */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-4 md:p-6">

        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Add New Student
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Input label="Name" name="name" value={data.name} onChange={handleChange} />
          <Input label="Roll No" name="roll" value={data.roll} onChange={handleChange} />
          <Input label="Class" name="className" value={data.className} onChange={handleChange} />
          <Input label="Division" name="division" value={data.division} onChange={handleChange} />
          <Input label="Father Name" name="fatherName" value={data.fatherName} onChange={handleChange} />
          <Input label="Mobile" name="mobile" value={data.mobile} onChange={handleChange} type="tel" />

          {/* Address full width */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Address</label>
            <textarea
              name="address"
              rows="3"
              value={data.address}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded bg-blue-50 focus:outline-none focus:border-primary-200"
              required
            />
          </div>

          {/* Photo */}
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 items-center">
            <div>
              <label className="text-sm font-medium">Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="block mt-1"
              />
            </div>

            {photo && (
              <img
                src={URL.createObjectURL(photo)}
                alt="preview"
                className="w-20 h-20 rounded-lg object-cover border"
              />
            )}
          </div>

          {/* BUTTON */}
          <div className="md:col-span-2">
            <button
              disabled={loading}
              className="w-full py-2 rounded-xl font-semibold text-white bg-primary-200 hover:bg-primary-300 transition"
            >
              {loading ? "Saving..." : "Save Student"}
            </button>
          </div>
        </form>

        {/* QR PREVIEW */}
        {qrURL && (
          <div className="mt-6 text-center">
            <QrCode className="mx-auto text-primary-200" />
            <img
              src={qrURL}
              className="mx-auto mt-2 border rounded p-1"
            />
            <p className="text-sm text-gray-600 mt-1">{studentId}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* 🔹 Reusable Input */
function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="mt-1 p-2 border rounded bg-blue-50 focus:outline-none focus:border-primary-200"
      />
    </div>
  ); 
}
