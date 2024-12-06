"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required"
    }),
})

export default function CreatePage() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try {

   
          const response = await axios.post("/api/courses", values);

          router.push(`/teacher/courses/${response.data.id}`);
          
          toast.success(`Course ${values.title} created successfully`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error : any) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            toast.error(`Server responded with ${error.response.status} error`);
          } else if (error.request) {
            // The request was made but no response was received
            toast.error("No response received from server");
          } else {
            // Something happened in setting up the request that triggered an Error
            toast.error(`Error: ${error.message}`);
          }
        }
      };
    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1  className="text-2xl">
               Nombre de tu curso nuevo
                </h1>

                <p className="text-sm text-slate-600">
                    Elige un nombre que sea descriptivo para tu curso. (No se pueden editar después) 
                </p>
                <Form { ...form } >
                    <form 
                        onSubmit={ form.handleSubmit(onSubmit) }
                        className="space-y-8 mt-8"
                    >
                        <FormField 
                            control={form.control}
                            name="title"
                            render={({field }) => (
                                <FormItem>
                                    <FormLabel>
                                       Titulo del curso
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Desarrollo de aplicaciones con Next.js'"
                                            { ...field } 
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        ¿Qué vas enseñar en este curso?
                                    </FormDescription>
                                    <FormMessage />

                                </FormItem>
                            )
                            }
                        />
                        <div className="flex items-center gap-x-2" >
                            <Link href="/teacher/courses">
                                <Button 
                                    variant="ghost"
                                    type="button"
                                >
                                    Cancelar
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Continuar
                            </Button>
                        </div>

                    </form>
                </Form>

            </div>
        </div>
    )

}