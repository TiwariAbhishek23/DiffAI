import { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async () => {
    if (!file || !startDate || !endDate) {
      alert("Please select file and date range");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);

    const response = await fetch("http://127.0.0.1:8000/find_emails", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Emails found:", data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          OST Email Finder
        </h1>

        {/* File Selector */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Select .ost file
          </label>
          <input
            type="file"
            accept=".ost,.pst"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {file && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* Date Pickers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Find Emails
        </button>
      </div>
    </div>
  );
}
