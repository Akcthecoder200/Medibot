import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Spinner } from "./Spinner";

export const PdfUpload = ({ onPdfUpload, isProcessing }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onPdfUpload(acceptedFiles[0]);
      }
    },
    [onPdfUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
        <Spinner />
        <p className="mt-4 text-lg font-medium">Processing your document...</p>
        <p className="text-sm">This may take a moment for large files.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div
        {...getRootProps()}
        className={`w-full max-w-2xl p-10 border-4 border-dashed rounded-xl cursor-pointer transition-colors duration-300
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-center">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {isDragActive ? (
            <p className="text-lg font-semibold text-blue-600">
              Drop the PDF here!
            </p>
          ) : (
            <>
              <p className="text-lg font-semibold text-gray-700">
                Drag & drop a medical PDF here
              </p>
              <p className="text-gray-500 mt-1">or click to select a file</p>
              <p className="text-xs text-gray-400 mt-4">
                Your document is processed locally in your browser and is not
                uploaded to any server for storage.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
