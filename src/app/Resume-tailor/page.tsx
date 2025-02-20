"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "@/components/Navbar/Navbar";

interface Section {
  title: string;
  content: string;
}

interface ResumeTailorProps {}

type FileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
type TextChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => void;
type GenerateHandler = (e: FormEvent<HTMLButtonElement>) => Promise<void>;
type CopyHandler = () => void;

// Function to convert File to base64
const convertPDFToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        if (typeof reader.result === "string") {
          const base64Data = reader.result.split(",")[1];
          resolve(base64Data);
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const ResumeTailor: React.FC<ResumeTailorProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [base64PDF, setBase64PDF] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCopy: CopyHandler = () => {
    const textContent = sections
      .map((section) => `${section.title}\n${section.content}`)
      .join("\n\n");

    navigator.clipboard
      .writeText(textContent)
      .then(() => {
        alert("Recommendations copied to clipboard!");
      })
      .catch((err: Error) => {
        console.error("Failed to copy:", err);
      });
  };

  const selectFileHandler: FileChangeHandler = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      try {
        // Convert the file to base64
        const base64String = await convertPDFToBase64(selectedFile);
        setBase64PDF(base64String);
        console.log("Base64 PDF:", base64String); // You can remove this log in production
      } catch (error) {
        console.error("Error converting file to base64:", error);
        alert("Error processing the file. Please try again.");
      }
    }
  };

  const changeTextHandler: TextChangeHandler = (e) => {
    setDesc(e.target.value);
  };

  const generateHandler: GenerateHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!file || !base64PDF || desc === "") {
      alert("Please provide both a resume and a job description.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("base64PDF", base64PDF); // Add base64 string to formData

    try {
      const tailoredResponse = await fetch(`/api/get-resume-score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          desc,
          base64Content: base64PDF,
        }),
      });

      if (!tailoredResponse.ok) {
        throw new Error("Failed to analyze resume");
      }

      const data = await tailoredResponse.json();
      if (data && data.sections) {
        setSections(data.sections);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error analyzing your resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col ">
      <Navbar />
      <div className="w-full flex items-center">
        <div className="w-full md:flex md:items-center md:justify-evenly p-5 lg:p-8">
          <div className="w-full md:w-[90%] md:gap-[20px] flex flex-col md:flex-row ">
            {sections.length === 0 ? (
              <div className="bg-white md:w-[50%] rounded-lg shadow-md p-6 mb-8">
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  HOW IT WORKS:
                </div>
                <div className="text-gray-600 space-y-2">
                  <p>🎯 Get an ATS match score for your resume</p>
                  <p>🔑 Identify missing important keywords</p>
                  <p>💡 Receive specific modification suggestions</p>
                  <p>📝 Learn which skills to add</p>
                  <p>⚠ Find formatting issues that affect ATS</p>
                  <p>✨ Enhance your achievements</p>
                </div>
              </div>
            ) : (
              <div className="w-full lg:w-[45%] bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    ATS Optimization Results
                  </h3>
                  <button
                    className="px-4 py-2 bg-green-500 text-[13px] hover:bg-green-600 text-white rounded-lg"
                    onClick={handleCopy}
                  >
                    Copy All
                  </button>
                </div>

                <div className="space-y-6">
                  {sections.map((section, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all"
                    >
                      <h4 className="text-lg font-semibold text-gray-700 mb-2 pb-2 border-b border-gray-200">
                        {section.title}
                      </h4>
                      <div className="text-gray-600">
                        {section.content.split("\n").map((line, i) => (
                          <p key={i} className="mb-2">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              className={`flex flex-col lg:flex-row gap-6 w-full lg:w-[90%] mx-auto ${
                sections.length > 0 ? "active" : ""
              }`}
            >
              <div className="w-full h-fit lg:w-[100%] bg-white rounded-lg shadow-md p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                      ATS Resume Optimizer 👇
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Get expert recommendations to pass ATS screening
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Upload Resume (PDF)
                    </label>
                    <input
                      type="file"
                      className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                      onChange={selectFileHandler}
                      accept=".pdf"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Paste Job Description
                    </label>
                    <textarea
                      className="w-full min-h-[150px] p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={desc}
                      onChange={changeTextHandler}
                      placeholder="Paste the complete job description here..."
                    />
                  </div>

                  <button
                    className={`w-full py-3 rounded-lg font-semibold text-white ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    onClick={generateHandler}
                    disabled={loading}
                  >
                    {loading ? "Analyzing..." : "Analyze Resume"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeTailor;
