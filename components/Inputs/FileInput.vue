<script setup lang="ts">
type IProps = {
  modelValue: FileList | null;
};
const toast = useToast();
const props = defineProps<IProps>();
const emits = defineEmits<{
  (
    e: "update:modelValue",
    value: FileList | null,
    isRequestToRemoveImage: boolean
  ): void;
}>();

// Layout
const model = useVModel(props, "modelValue", emits);
const { files, open, reset, onChange } = useFileDialog({ multiple: false });

const removeImage = () => {
  emits("update:modelValue", null, true);
  reset();
};

onChange((files) => {
  const file = files[0];
  if (file.size > 1000000) {
    toast.add({
      title: 'Failed, Image size is too big!',
      description: 'Upload Image with max of 1MB.',
      timeout: 4000,
      color: 'red',
    });
    removeImage();
  } else {
    // Read the file as a data URL
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result as string;
      // Check if the data URL starts with 'data:image/'
      if (dataURL.startsWith('data:image/')) {
        model.value = files; // It's an image, set the model value
      } else {
        toast.add({
          title: 'Failed, Invalid file format!',
          description: 'Please upload an image file.',
          timeout: 4000,
          color: 'red',
        });
        removeImage();
      }
    };
    reader.readAsDataURL(file);
  }
});
</script>

<template>
  <div class="flex flex-row gap-x-3">
    <UButton
      type="button"
      color="white"
      size="lg"
      @click="open()"
      label="Upload Image"
    />

    <UButton
      @click="removeImage"
      icon="i-heroicons-pencil-square"
      size="lg"
      color="red"
      variant="outline"
      label="Remove image"
      :trailing="false"
    />
  </div>
  <ul class="p-[10px] bg-[#111827] rounded-md mt-2" v-if="files">
    <li v-for="file in files" :key="file.name">
      {{ file.name }}
    </li>
  </ul>
</template>
