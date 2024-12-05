"use client";
import * as z from "zod";
import axios from "axios";
import { PlusCircle, File, Loader2, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";


interface AttachmentFormProps {
  initialData: Course & { attachments?: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
  originalFilename: z.string().min(1),
});

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = formSchema.parse(values);
      await axios.post(`/api/courses/${courseId}/attachments`, result);
      toast.success("Adjunto creado");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Algo salió mal");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800 dark:text-slate-300">
      <div className="font-medium flex items-center justify-between">
        Adjuntos del curso
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancelar</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar archivo
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments && initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No hay adjuntos aun
            </p>
          )}
          {initialData.attachments && initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs line-clamp-1 hover:underline"
                  >
                    {attachment.name}
                  </a>
                  {deletingId === attachment.id && (
                    <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      title="Delete attachment"
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url, originalFilename) => {
              if (url && originalFilename) {
                onSubmit({ url: url, originalFilename: originalFilename });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Añade todo lo que tus estudiantes van a necesitar para el curso.
          </div>
        </div>
      )}
    </div>
  );
};
