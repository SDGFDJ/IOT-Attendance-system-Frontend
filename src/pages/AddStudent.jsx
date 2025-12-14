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
  className: "",  // <- updated
  division: "",
  fatherName: "",
  mobile: "",
  address: "",
});

  const [photo, setPhoto] = useState(null);
  const [qrURL, setQrURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState("");

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
      // Backend request
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (photo) formData.append("photo", photo);

      const response = await Axios({
        ...SummaryApi.addStudent,
        data: formData,
      });

      if (response.data.success) {
        const id = response.data.data.studentId;
        setStudentId(id);

        const qrData = `ID:${id}|Name:${data.name}|Roll:${data.roll}`;
        const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

        setQrURL(qrAPI);
        toast.success("Student Added Successfully!");

        // Navigate to list after few sec
        setTimeout(() => navigate("/dashboard/students"), 1500);

        // Reset form
        setData({
        name: "",
  roll: "",
  className: "",  // <- updated
  division: "",
  fatherName: "",
  mobile: "",
  address: "",
        });
        setPhoto(null);
      }

    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">

      <h2 className="text-lg font-semibold mb-4">Add New Student</h2>

      <form className="my-4 grid gap-4" onSubmit={handleSubmit}>

        <div className="grid">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
            value={data.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid">
          <label>Roll No *</label>
          <input
            type="text"
            name="roll"
            className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
            value={data.roll}
            onChange={handleChange}
            required
          />
        </div>

<label>Class *</label>
<input
  type="text"
  name="className"
  className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
  value={data.className}
  onChange={handleChange}
  required
/>


        <div className="grid">
          <label>Division *</label>
          <input
            type="text"
            name="division"
            className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
            value={data.division}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid">
          <label>Father Name *</label>
          <input
            type="text"
            name="fatherName"
            className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
            value={data.fatherName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid">
          <label>Mobile *</label>
          <input
            type="number"
            name="mobile"
            className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
            value={data.mobile}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid">
          <label>Address *</label>
          <textarea
            name="address"
            rows="3"
            className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
            value={data.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid">
          <label>Upload Photo</label>
          <input
            type="file"
            accept="image/*"
            className="border p-1 rounded"
            onChange={handlePhotoUpload}
          />
        </div>

        {photo && (
          <img
            src={URL.createObjectURL(photo)}
            alt="preview"
            className="w-20 h-20 object-cover rounded-md"
          />
        )}

        <button
          disabled={loading}
          className="border px-4 py-2 font-semibold hover:bg-primary-100 border-primary-100 text-primary-200 rounded"
        >
          {loading ? "Saving..." : "Save Student"}
        </button>
      </form>

      {/* QR Preview */}
      {qrURL && (
        <div className="text-center my-4">
          <QrCode size={42} className="text-primary-200 mx-auto" />
          <img src={qrURL} className="mx-auto border rounded p-1 mt-2" />
          <p className="text-sm text-gray-600">{studentId}</p>
        </div>
      )}

    </div>
  );
}
