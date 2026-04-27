export type ProductStatus = "active" | "inactive";

export type ProductTabValue = "all" | ProductStatus;

export type ProductListItem = {
  id: string;
  type: string;
  image: string;
  nameTh: string;
  nameEn: string;
  price: number;
  stockReal: number;
  stockReserved: number;
  created: string;
  updated: string;
  status: ProductStatus;
};

export type ProductItem = {
  id: string;
  type: string;
  url: string;
  image: string;
  nameTh: string;
  headingTh: string;
  altTextTh: string;
  titleSummaryTh: string;
  metaTitleTh: string;
  metaKeywordTh: string;
  metaDescriptionTh: string;
  descriptionTh: string;
  nameEn: string;
  headingEn: string;
  altTextEn: string;
  titleSummaryEn: string;
  metaTitleEn: string;
  metaKeywordEn: string;
  metaDescriptionEn: string;
  descriptionEn: string;
  price: number;
};
