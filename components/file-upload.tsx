"use client";

import toast from "react-hot-toast";
import "@uploadthing/react/styles.css";
import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  onChange: (url?: string, originalFilename?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      appearance={{
        label: "Subir un archivo",
      }}
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        console.log("onClientUploadComplete res:", res);
        onChange(res?.[0].url, res?.[0].name);
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
    />
  );
};
