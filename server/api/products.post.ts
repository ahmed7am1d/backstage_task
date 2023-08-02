import { PrismaClient } from "@prisma/client";
import {
  ProductCreationRequest,
  ProductCreationResponse,
} from "../../types/IProductCreation";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  //[1]- Reading the body of the request
  const body = await readBody<ProductCreationRequest>(event);

  //[2]- Validate the required fields
  if (!body.title || !body.description || !body.price) {
    throw createError({
      statusCode: 400,
      statusMessage:
        '"Product title, description, and price are required fields.',
    });
  }

  //[2]- Creating Request DTO
  //For simplicity and purpose of small project there is no need to use object mapper library (like AutoMapper in c# :-) )
  const productToAdd: ProductCreationRequest = {
    description: body.description,
    title: body.title,
    price: body.price,
    image: body.image,
  };

  //[3]- Add the product to the DB
  const product = await prisma.product.create({
    data: productToAdd,
  });
  //[4]- Creating Response DTO
  const productCreationResponse: ProductCreationResponse = {
    id: product.id,
    description: product.description,
    price: product.price,
    title: product.title,
    image: product.image,
  };
  //[4]- Return the created product
  return {
    productCreationResponse,
  };
});
