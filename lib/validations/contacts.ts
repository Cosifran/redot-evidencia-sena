import * as z from "zod"

export const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingrese un correo electrónico válido.",
  }),
  phone: z.string().min(10, {
    message: "Por favor ingrese un número de teléfono válido.",
  }),
  subject: z.string().min(2, {
    message: "Por favor ingrese un asunto.",
  }),
  message: z.string().optional(),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
