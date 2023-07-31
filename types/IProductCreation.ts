export type ProductCreationRequest = {
  title: string;
  description: string;
  price: number;
  image: string;
};

export type ProductCreationResponse = {
  id:number
  title: string;
  description: string;
  price: number;
  image: string | null;
};