<script setup lang="ts">
//
</script>

<template>
  <div class="wrapper">
    <div class="wrapper-header">
      <p class="first-letter:font-bold first-letter:bg-white first-letter:text-black first-letter:p-1 ">Back
        <span class="font-bold">S</span>tage
      </p>
   
    </div>

    <NuxtLink to="/task">
      Task
    </NuxtLink>


    <NuxtLink to="/products">
      Products
    </NuxtLink>

    <NuxtLink to="/products/AddProducts">
      Create product
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  @apply flex flex-col gap-y-8 w-full h-full items-center justify-center;

  &-header {
    @apply text-3xl shadow-lg  shadow-gray-600 p-4 rounded-md w-80 text-center
    bg-slate-500/50 text-slate-600 border-slate-600
    dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-300
  }
}
</style>
