import { useRef, useState, useCallback } from "react";

const ACCEPTED = ".pdf,.txt";
const ACCEPTED_TYPES = ["application/pdf", "text/plain"];

export default function DropZone({ file, onFile, label = "file" }) {
  const [over, setOver] = useState(false);
  const inputRef = useRef();

  const handleFile = useCallback(
    (f) => {
      if (!f) return;
      if (!ACCEPTED_TYPES.includes(f.type)) {
        alert("Please upload a PDF or plain text file.");
        return;
      }
      onFile(f);
    },
    [onFile]
  );

  return (
    <div
      className={`dropzone ${over ? "over" : ""} ${file ? "has-file" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="file-input"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {file ? (
        <>
          <div className="drop-icon">✓</div>
          <div className="drop-text"><strong>{file.name}</strong></div>
          <div className="file-name">
            {(file.size / 1024).toFixed(1)} KB · click to replace
          </div>
        </>
      ) : (
        <>
          <div className="drop-icon">⬆</div>
          <div className="drop-text">
            <strong>Drop {label} here</strong>
            <br />
            or click to browse · PDF or TXT
          </div>
        </>
      )}
    </div>
  );
}
