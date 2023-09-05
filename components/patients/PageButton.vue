<template>
  <nuxt-link :to="to" class="page-button" :class="`${background}`">
    <div class="text-xl font-medium">
      {{ text }}
    </div>
    <img :src="iconPath" :width="75" :alt="text">
  </nuxt-link>
</template>

<script setup lang="ts">

defineProps({
  text: {
    type: String,
    required: true
  },
  iconPath: {
    type: String,
    required: true
  },
  background: {
    type: String,
    required: true,
    validator: (value: string) => ['bg-brand-light-tertiary'].includes(value)
  },
  to: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.page-button {
  @apply py-5 text-center w-[190px] flex flex-col items-center rounded-2xl;
}
</style>
