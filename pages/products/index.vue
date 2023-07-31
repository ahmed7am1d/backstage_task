<script setup lang="ts">
import { IProduct } from "types/IProduct";
import { GET_PRODUCTS_API_URL } from "../../constants/api/product";

//[1]- Getting products data
const {
  data: products,
  pending: productsPending,
  error: productsError,
  refresh,
} = await useFetch<IProduct[]>(GET_PRODUCTS_API_URL);
</script>

<template>
  <div class="productsPageWrapper">
    <h1 class="pageTitle my-2 relative w-fit">Products</h1>
    <p v-if="productsPending">Fetching ....</p>
    <p v-else-if="productsError">
      Could not load products: {{ productsError.data }}
    </p>
    <div class="productsWrapper" v-else>
      <div class="productWrapper" v-for="product in products">
        <!-- Product's image -->
        <div class="aspect-w-3 aspect-h-2 w-full rounded-t-lg bg-[#DDDDDD]">
          <img
            :src="product.image || undefined"
            alt="Product Image"
            class="object-contain w-full h-full rounded-t-lg"
          />
        </div>
        <div class="productInfoWrapper">
          <!-- Product's title -->
          <p class="text-xl font-bold">{{ product.title }}</p>
          <!-- Product's description -->
          <p class="text-gray-300">{{ product.description }}</p>
          <!-- Product's Cart and price section -->
          <div class="mt-4 flex items-end justify-evenly w-full h-full">
            <p class="text-lg px-4 py-2">
              {{ formatToDollarCurrency(product.price) }}
            </p>
            <button
              class="px-4 py-2 bg-gray-300 rounded-md text-black w-fit hover:bg-gray-400 transition-all duration-200"
            >
              <div class="flex flex-row items-center gap-2">
                <Icon name="ps:30-80" color="black" class="w-[20px] h-[20px] mt-1" />
                <span class="w-full h-full text-gray-700">Add to cart</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.productsPageWrapper {
  @apply px-2;
  .productsWrapper {
    @apply mb-2 h-full w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4;
    .productWrapper {
      @apply flex flex-col items-start gap-y-4 bg-[#232528]  text-white  transform
      transition duration-150
      hover:scale-105 hover:z-10 hover:bg-[#404956] hover:cursor-pointer;
      .productInfoWrapper {
        @apply flex flex-col items-start gap-y-5 h-full p-2 pb-5 w-full;
      }
    }
  }
}
</style>
