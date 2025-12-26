import { z } from "zod";

export const writerApplicationSchema = z.object({
    fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalı"),
    university: z.string().optional(),
    phone: z.string().optional(),
    interestArea: z.string().min(3, "İlgi alanı belirtmelisin"),
    menemenPreference: z.enum(["soganli", "sogansiz"], {
        required_error: "Bu hayati bir soru, cevaplamalısın.",
    }),
    email: z.string().email("Geçerli bir e-posta adresi gir"),
    experience: z.string().optional(),
    about: z.string().min(10, "Kendini biraz daha detaylı anlat"),
});

export type WriterApplicationFormValues = z.infer<typeof writerApplicationSchema>;
