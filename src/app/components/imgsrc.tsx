'use client';

import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { ImgSrcProps } from "@/app/lib/definitions";
import styles from '@/app/ui/new_edit_post.module.css';
import Image from "next/image";


export default function ImageInput({ onImageChange, initialImage }: ImgSrcProps) {
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    if (initialImage) {
        setPreview(initialImage);
        onImageChange(initialImage);
    }
  }, [initialImage, onImageChange]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image too large (max 2MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 300;
        let { width, height } = img;
        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const resized = canvas.toDataURL("image/jpeg", 0.7);
        setPreview(resized);
        onImageChange(resized);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  function capturePhoto() {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreview(imageSrc);
      onImageChange(imageSrc);
    }
  }

  return (
    <div className="image-input">
      <label className={styles.entryLabel} htmlFor="imageMode">Mode: </label>
      <select
        id="imageMode"
        className={styles.entryLabel}
        value={mode}
        onChange={(e) => setMode(e.target.value as "upload" | "camera")}
      >
        <option value="upload">Upload</option>
        <option value="camera">Camera</option>
      </select>
      {mode === "upload" && (
        <div className={styles.fileUpload}>
          <label htmlFor="fileInput" className={styles.customButton}>
            Choose Image
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.hiddenFileInput}
          />
          {/* <span className={styles.fileName}>
            {selectedFile ? selectedFile.name : "No image chosen"}
          </span> */}
        </div>
      )}


      {/* <br />
      {mode === "upload" && (
        <input
          className={styles.imgSelect}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        /> 
      )}*/}

      {mode === "camera" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={300}
            videoConstraints={{ facingMode: "environment" }}
          />
          <button type="button" onClick={capturePhoto}>Capture</button>
        </div>
      )}

      {preview && (
        <div className="image-preview">
          <p>Preview:</p>
          <Image
            src={preview}
            alt="Preview"
            width={200}
            height={200}
            style={{ maxWidth: "200px", borderRadius: "8px" }}
          />
        </div>
      )}
    </div>
  );
}
