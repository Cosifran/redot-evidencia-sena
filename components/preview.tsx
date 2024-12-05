"use client";
import "react-quill-new/dist/quill.bubble.css";
import ReactQuill from "react-quill-new";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  // Import Quill w/o server side rendering to prevent hydration errors.

  return (
    <div className="bg-white dark:bg-slate-700">
      <ReactQuill theme="bubble" value={value} readOnly={true} />
    </div>
  );
};
