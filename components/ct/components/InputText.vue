<template>
  <div>
    <label class="block mb-2 text-sm font-medium text-brand-black">
      {{ label }}
    </label>
    <Input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      class="focus:ring-brand-light-secondary"
    />
  </div>
</template>
<script setup lang="ts">
import { Input } from 'flowbite-vue'
import { PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: String
  },
  label: {
    type: String,
    default: undefined
  },
  placeholder: {
    type: String,
    default: undefined
  },
  autocomplete: {
    type: String,
    default: undefined
  },
  required: {
    type: Boolean,
    default: false
  },
  type: {
    type: String as PropType<'number' | 'button' | 'time' | 'image' | 'text' | 'hidden' | 'color' | 'search' | 'submit' | 'reset' | 'date' | 'checkbox' | 'file' | 'datetime-local' | 'email' | 'month' | 'password' | 'radio' | 'range' | 'tel' | 'url' | 'week'>,
    default: 'text'
  }
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string | undefined): void
}>()
const model = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})
</script>
