<template>
  <Button
    :class="`bg-brand-${color} hover:bg-brand-${color} rounded-lg text-white font-medium`"
    :disabled="disabled"
    :tag="tag"
    :size="size"
    :color="undefined"
    :to="to"
    :href="href"
    @click="click"
  >
    <slot />
  </Button>
</template>
<script setup lang="ts">
import { Button } from 'flowbite-vue'

interface Props {
  /**
   * Specify a custom tag used on the root element.
   */
  tag?: string,
  /**
   * Removes the ability to click or target the component
   */
  disabled?: boolean,
  /**
   * Denotes the target route of the link
   */
  to?: string | undefined,
  /**
   * Designates the component as anchor and applies the href attribute.
   */
  href?: string,
  /**
   * Sets the height and width of the component. Default unit is px. Can also use the following predefined sizes: x-small, small, default, large, and x-large.
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Applies specified color to the control - it can be the name of material color (for example success or purple) or css color (#033 or rgba(255, 0, 0, 0.5))
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'red'
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  color: 'secondary',
  size: 'md',
  href: undefined,
  to: undefined,
  tag: 'button'
})

const emit = defineEmits<{(e: 'click'): void }>()

const click = () => {
  emit('click')
}
</script>
