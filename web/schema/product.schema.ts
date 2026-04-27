import { z } from "zod";

export const ProductFormSchema = z.object({
  id: z.string().optional(),

  type: z.string().min(1),
  url: z.string().min(1),

  nameTh: z.string().min(1),
  headingTh: z.string().min(1),
  altTextTh: z.string().min(1),
  titleSummaryTh: z.string().min(1),
  metaTitleTh: z.string().min(1),
  metaKeywordTh: z.string().min(1),
  metaDescriptionTh: z.string().min(1),
  descriptionTh: z.string().optional(),

  nameEn: z.string().min(1),
  headingEn: z.string().min(1),
  altTextEn: z.string().min(1),
  titleSummaryEn: z.string().min(1),
  metaTitleEn: z.string().min(1),
  metaKeywordEn: z.string().min(1),
  metaDescriptionEn: z.string().min(1),
  descriptionEn: z.string().optional(),

  price: z.number().min(1),

  images: z.array(z.instanceof(File)).optional(),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;