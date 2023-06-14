<template>
  <v-text-field
    v-model="model"
    :type="type"
    :rules="required ? REQUIRED_RULE : rules"
    :placeholder="placeholder"
    :label="label"
    :append-inner-icon="appendInnerIcon"
    density="compact"
    variant="solo"
    class="input-text"
    @click:append-inner="emit('click:appendInner')"
  />
</template>
<script setup lang="ts">
import { FunctionalComponent } from 'vue'
import { REQUIRED_RULE } from '~/constants/form-rules'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  rules?: [] | [((v: any) => boolean | string)]
  required?: boolean
  type?: string
  appendInnerIcon?: string | (new () => any) | FunctionalComponent
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  type: 'text',
  placeholder: undefined,
  label: undefined,
  appendInnerIcon: undefined
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string | undefined): void
  (e: 'click:appendInner'): void
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
<style lang="scss">
.input-text {
  .v-field__outline {
    &__start,
    &__notch::before,
    &__notch::after,
    &__end {
      border-color: #69A297 !important;
    }

    &__notch {
      border-width: 0 !important;
    }
  }
  .v-field--variant-solo {
    @apply shadow;
  }
}
</style>

<style lang="scss">
.input-text {
}
</style>
