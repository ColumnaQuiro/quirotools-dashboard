<template>
  <v-btn
    class="button"
    :disabled="disabled"
    :tag="tag"
    :block="block"
    :icon="icon"
    :variant="variant"
    :size="size"
    :to="to"
    :href="href"
    :color="color"
    elevation="0"
    @click="click"
  >
    <slot />
  </v-btn>
</template>
<script setup lang="ts">
import { FunctionalComponent } from 'vue'

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
   * Expands the button to 100% of available space
   */
  block?: boolean,
  /**
   * Designates the button as icon. Button will become round and applies the text prop
   */
  icon?: boolean | string | (new () => any) | FunctionalComponent,
  /**
   * Denotes the target route of the link
   */
  to?: string | undefined,
  /**
   * Designates the component as anchor and applies the href attribute.
   */
  href?: string,
  /**
   * Applies one of 6 styles: elevated, flat, tonal, outlined, text, and plain.
   */
  variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain',
  /**
   * Sets the height and width of the component. Default unit is px. Can also use the following predefined sizes: x-small, small, default, large, and x-large.
   */
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large',
  /**
   * Applies specified color to the control - it can be the name of material color (for example success or purple) or css color (#033 or rgba(255, 0, 0, 0.5))
   */
  color?: string
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  block: false,
  text: false,
  color: 'primary',
  size: 'default',
  href: undefined,
  variant: 'elevated',
  to: undefined,
  icon: false,
  tag: 'button'
})

const emit = defineEmits<{(e: 'click'): void }>()

const click = () => {
  emit('click')
}
</script>
<style lang="scss" scoped>
.button {
  text-transform: none !important;
}
</style>
