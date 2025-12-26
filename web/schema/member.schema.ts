import z from "zod";

export const MemberFormSchema = z
  .object({
    id: z.string().optional(),
    role: z.string(),
    username: z
      .string()
      .min(4, "ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร")
      .max(20, "ชื่อผู้ใช้ต้องไม่เกิน 20 ตัวอักษร")
      .regex(/^[a-zA-Z0-9]+$/, "ใช้ได้เฉพาะภาษาอังกฤษและตัวเลขเท่านั้น"),
    email: z.string().min(1, "กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || val.length >= 8,
        "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
      )
      .refine(
        (val) => !val || /[A-Z]/.test(val),
        "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว"
      )
      .refine(
        (val) => !val || /[a-z]/.test(val),
        "รหัสผ่านต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว"
      )
      .refine(
        (val) => !val || /[0-9]/.test(val),
        "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว"
      ),
    confirmPassword: z.string().optional().or(z.literal("")),
    phone: z
      .string()
      .min(10, "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก")
      .max(10, "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก")
      .regex(/^0[0-9]{9}$/, "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง"),
    profile: z.instanceof(File).optional().nullable(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password && password.length > 0) {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "รหัสผ่านไม่ตรงกัน",
        });
      }
    }
  });
export type MemberFormSchema = z.infer<typeof MemberFormSchema>;
