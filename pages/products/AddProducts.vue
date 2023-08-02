<script setup lang="ts">
import { required, numeric, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {
  ProductCreationRequest,
  ProductCreationResponse,
} from "types/IProductCreation";
import { POST_PRODUCTS_API_URL } from "../../constants/api/product";
import { useBase64 } from "@vueuse/core";

const toast = useToast();
const router = useRouter();

const uploadedProductImageFiles = ref<FileList | null>(null);
const selectedProductImage = ref<File | null>(null);
let selectedProductImageBase64 = ref() as Ref<string>;

const showProductImageUrlInput = ref<boolean>(true);

// #region Form validation

//Define form data
const formData = reactive({
  productTitle: "",
  productDescription: "",
  productPrice: null,
  productImageUrl: "",
});

//Creating the rules
const rules = computed(() => {
  return {
    productTitle: {
      required: helpers.withMessage(
        "The product title field is a required.",
        required
      ),
    },

    productDescription: {
      required: helpers.withMessage(
        "The product description is a required field.",
        required
      ),
    },

    productPrice: {
      required: helpers.withMessage(
        "The product price is a required field.",
        required
      ),
      numeric: helpers.withMessage(
        "The product price field should be a numeric field.",
        numeric
      ),
    },
  };
});

//Compare the rules to the form data
const v$ = useVuelidate(rules, formData);

// #endregion

// #region Handle form submission
const handleFormSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    return;
  } else {
    // Convert productPrice to a number or set a default value for empty price
    //For purpose of typescript safety
    const productPrice =
      formData.productPrice !== null ? Number(formData.productPrice) : 0;

    //Creating Request DTO
    const productCreationRequest: ProductCreationRequest = {
      price: productPrice,
      description: formData.productDescription,
      title: formData.productTitle,
      image: formData.productImageUrl
        ? formData.productImageUrl
        : selectedProductImageBase64.value
        ? selectedProductImageBase64.value
        : "https://placehold.co/600x400/png",
    };

    //Make API Call to add product
    await useFetch<ProductCreationResponse>(POST_PRODUCTS_API_URL, {
      method: "POST",
      body: productCreationRequest,
      onResponse({ response }) {
        if (response?.ok) {
          toast.add({
            title: "Success!",
            description: "Product successfully added",
            timeout: 3000,
            color: "green",
            actions: [
              {
                variant: "solid",
                color: "white",
                label: "Navigate to products",
                click: () => {
                  router.push({ path: "/products" });
                },
              },
            ],
          });

          //After successful submission clear the fields:
          formData.productTitle = "";
          formData.productDescription = "";
          formData.productPrice = null;
          formData.productImageUrl = "";

          //Reset Vuelidate validation state
          v$.value.$reset();
        }
      },
      onResponseError({ response }) {
        toast.add({
          title: "Failed to add product!",
          description: `Server response: ${response.statusText}`,
          timeout: 4000,
          color: "red",
        });

        //After successful submission clear the fields:
        formData.productTitle = "";
        formData.productDescription = "";
        formData.productPrice = null;
        formData.productImageUrl = "";
        
        //Reset Vuelidate validation state
        v$.value.$reset();
      },
    });
  }
};
// #endregion

// #region Handle Product's image upload

const handleProductImageChange = async (
  selectedFiles: FileList | null,
  isRequestToRemoveImage: boolean
) => {
  if (isRequestToRemoveImage) {
    showProductImageUrlInput.value = true;
    uploadedProductImageFiles.value = null;
    selectedProductImage.value = null;
  } else {
    if (selectedFiles !== null && selectedFiles.length > 0) {
      // Hide the input field for image url and clear the field
      showProductImageUrlInput.value = false;
      formData.productImageUrl = "";

      // Save the selected image, and selected files (in case in future one product has many pictures)
      uploadedProductImageFiles.value = selectedFiles;
      selectedProductImage.value = selectedFiles[0];

      // Transfer the image to base64 and save it to form data
      const { base64: productImageBase64 } = useBase64(
        selectedProductImage.value
      );
      selectedProductImageBase64 = productImageBase64;
    } else {
      uploadedProductImageFiles.value = null;
      selectedProductImage.value = null;
    }
  }
};

// #endregion
</script>

<template>
  <div class="addProductPageWrapper">
    <div class="mb-10 mt-5 w-full flex flex-col justify-center items-center">
      <h1 class="text-center">Add Products</h1>
      <p class=" productsTitleDivider text-center text-gray-500">
        Add your products to the EShop, upload an image or put an online url of an image.
      </p>
    </div>
    <form
      @submit.prevent="handleFormSubmit"
      class="flex flex-col items-center justify-center w-full gap-y-4"
    >
      <!-- Product's title -->
      <div class="productTextOrNumberIG">
        <label>Product title</label>
        <input
          v-model="formData.productTitle"
          type="text"
          id="productTitle"
          name="productTitle"
          class="productInput"
          :class="{
            ' ring-red-600 ring-1 focus:ring-1 focus:ring-red-600':
              v$.productTitle.$error,
            'ring-[#42d392] ring-1 focus:ring-1 focus:ring-[#42d392] ':
              !v$.productTitle.$invalid,
          }"
          placeholder="Product name..."
          @input="v$.productTitle.$touch"
        />
        <!-- The icon is going to render but the name of the icon it will depend on the validation output and the color as well -->
        <Icon
          v-if="!v$.productTitle.$invalid || v$.productTitle.$error"
          class="absolute right-2 top-3 h-full text-xl text-green-500"
          :class="{
            'text-green-500': !v$.productTitle.$invalid,
            'text-yellow-500 top-[5px]': v$.productTitle.$error,
          }"
          :name="`heroicons-solid:${
            !v$.productTitle.$error ? 'check-circle' : 'exclamation'
          }`"
        />
        <span class="text-xs text-red-500" v-if="v$.productTitle.$error">{{
          v$.productTitle.$errors[0].$message
        }}</span>
      </div>

      <!-- Product's description -->
      <div class="productTextOrNumberIG">
        <label>Product Description</label>
        <textarea
          v-model="formData.productDescription"
          id="productDescription"
          name="productDescription"
          class="productInput"
          :class="{
            ' ring-red-600 ring-1 focus:ring-1 focus:ring-red-600':
              v$.productDescription.$error,
            'ring-[#42d392] ring-1 focus:ring-1 focus:ring-[#42d392] ':
              !v$.productDescription.$invalid,
          }"
          placeholder="Brief product's description..."
          @input="v$.productDescription.$touch"
        />
        <!-- The icon is going to render but the name of the icon it will depend on the validation output and the color as well -->
        <Icon
          v-if="!v$.productDescription.$invalid || v$.productDescription.$error"
          class="absolute right-2 -top-3 h-full text-xl text-green-500"
          :class="{
            'text-green-500': !v$.productDescription.$invalid,
            'text-yellow-500': v$.productDescription.$error,
          }"
          :name="`heroicons-solid:${
            !v$.productDescription.$error ? 'check-circle' : 'exclamation'
          }`"
        />
        <span
          class="text-xs text-red-500"
          v-if="v$.productDescription.$error"
          >{{ v$.productDescription.$errors[0].$message }}</span
        >
      </div>

      <!-- Product's price -->
      <div class="productTextOrNumberIG">
        <label>Product price</label>
        <input
          v-model="formData.productPrice"
          type="text"
          id="productPrice"
          name="productPrice"
          class="productInput"
          :class="{
            ' ring-red-600 ring-1 focus:ring-1 focus:ring-red-600':
              v$.productPrice.$error,
            'ring-[#42d392] ring-1 focus:ring-1 focus:ring-[#42d392] ':
              !v$.productPrice.$invalid,
          }"
          placeholder="Price in number..."
          @input="v$.productPrice.$touch"
        />
        <!-- The icon is going to be rendered but the name of the icon it will depend on the validation output and the color as well -->
        <Icon
          v-if="!v$.productPrice.$invalid || v$.productPrice.$error"
          class="absolute right-2 top-3 h-full text-xl text-green-500"
          :class="{
            'text-green-500': !v$.productPrice.$invalid,
            'text-yellow-500 top-[5px]': v$.productPrice.$error,
          }"
          :name="`heroicons-solid:${
            !v$.productPrice.$error ? 'check-circle' : 'exclamation'
          }`"
        />

        <span class="text-xs text-red-500" v-if="v$.productPrice.$error">{{
          v$.productPrice.$errors[0].$message
        }}</span>
      </div>

      <!-- Product's Image Url -->
      <div class="productTextOrNumberIG" v-if="showProductImageUrlInput">
        <label>Product image url</label>
        <input
          v-model="formData.productImageUrl"
          type="text"
          id="productImageUrl"
          name="productImageUrl"
          class="productInput"
          placeholder="Image url.."
        />
      </div>

      <!-- Upload Image -->
      <div class="productTextOrNumberIG">
        <FileInput
          v-model="uploadedProductImageFiles"
          @update:modelValue="handleProductImageChange"
        />
      </div>

      <!-- Form submission -->
      <div class="w-[90%] lg:w-[50%] md:w-[70%] sm:w-[90%] mx-auto">
        <button
          type="submit"
          class="rounded border-0 bg-white py-2 px-8 font-bold text-[#213547] transition-colors duration-200 hover:bg-gray-300 focus:outline-none"
        >
          Add Product
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.addProductPageWrapper {
  @apply w-full;
  .productTextOrNumberIG {
    @apply flex flex-col w-[90%] lg:w-[50%] md:w-[70%] sm:w-[90%] mx-auto relative;
    label {
      @apply text-gray-400 mb-1;
    }
  }
}

.productInput {
  @apply w-full px-2 py-3 rounded-md border border-none outline-none focus:outline-none focus:border-transparent;
}
</style>
