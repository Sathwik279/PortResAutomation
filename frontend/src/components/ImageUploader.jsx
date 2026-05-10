import { useState } from "react";

export default function ImageUploader({ currentImage, onUploadComplete }) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 1.5MB to keep JSON performance good)
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Image is too large! Please use a photo smaller than 1.5MB.");
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      onUploadComplete(base64String);
      setLoading(false);
    };

    reader.onerror = () => {
      alert("Failed to read file!");
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="image-uploader">
      <div className="uploader-preview">
        {currentImage ? (
          <img src={currentImage} alt="Profile" className="preview-thumb" />
        ) : (
          <div className="preview-placeholder">No Image</div>
        )}
      </div>
      
      <div className="uploader-actions">
        <label className="upload-label">
          {loading ? "Processing..." : "Select Photo"}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={loading}
            style={{ display: 'none' }}
          />
        </label>
        <p style={{ fontSize: '10px', color: '#6b7280', marginTop: '8px' }}>
          Max size: 1.5MB (No hosting required)
        </p>
      </div>

      <style>{`
        .image-uploader {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px;
          background: #182231;
          border-radius: 12px;
          border: 1px solid rgba(255,111,177,0.1);
        }
        .uploader-preview {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          background: #0b0f14;
          border: 2px solid #ff6fb1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .preview-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .preview-placeholder {
          font-size: 10px;
          color: #6b7280;
        }
        .upload-label {
          display: inline-block;
          background: #ff6fb1;
          color: #0b0f14;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .upload-label:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
