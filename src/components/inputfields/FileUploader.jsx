import React, { useState } from "react";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus(""); // Rensa status vid ny fil
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus("Vänligen välj en fil först.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://korkort24.com/api/quizimages/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.text();
        setStatus("Uppladdning lyckades: " + result);
      } else {
        setStatus("Uppladdning misslyckades.");
      }
    } catch (error) {
      setStatus("Fel: " + error.message);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="file"
        onChange={handleFileChange}
        accept="*"
      />
      <button
        type="submit"
        className="bg-primary text-white rounded"
      >
        Ladda upp
      </button>
      {status && <p>{status}</p>}
    </form>
  );
};

export default FileUploader;
