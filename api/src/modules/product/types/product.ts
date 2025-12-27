import { ProductStatus } from 'src/database/entities';

export type ProductsItem = {
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
