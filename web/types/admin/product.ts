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
