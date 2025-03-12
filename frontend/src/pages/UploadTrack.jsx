import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

const UploadTrack = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ title: "", language: "", file: null });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "file") {
      setFormData({ ...formData, file: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    const token = localStorage.getItem("token"); // Get token from localStorage
  
    if (!token) {
      setMessage("User not authenticated. Please log in again.");
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("language", formData.language);
    formDataToSend.append("track", formData.file); // Change "file" to "track"
  
    try {
      const response = await fetch("http://localhost:5000/api/tracks/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Use token from localStorage
        },
        body: formDataToSend,
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage("Track uploaded successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };
  
  

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">Upload a New Track</h2>
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Track Title"
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 rounded"
          required
        />

        {/* Language Selection Dropdown */}
        <select
          name="language"
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 rounded"
          required
        >
          <option value="">Select Language</option>
          <option value="Hindi">Hindi</option>
          <option value="English">English</option>
          <option value="Punjabi">Punjabi</option>
          <option value="Bhojpuri">Bhojpuri</option>
          <option value="Haryanvi">Haryanvi</option>
        </select>

        <input
          type="file"
          name="file"
          accept="audio/*"
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 rounded"
          required
        />
        <button className="w-full p-2 bg-purple-600 hover:bg-purple-700 rounded">
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadTrack;
