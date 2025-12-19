import { z } from "zod";
export const ShippingSchema = z.object({
  fullName: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล"),
  phoneNumber: z.string().min(1, "กรุณากรอกเบอร์โทรศัพท์"),
  addressLine: z.string().min(1, "กรุณากรอกที่อยู่"),
  city: z.string().min(1, "กรุณากรอกจังหวัด"),
  postalCode: z.string().min(1, "กรุณากรอกรหัสไปรษณีย์"),
  country: z.string().min(1),
});

export type ShippingSchema = z.infer<typeof ShippingSchema>;