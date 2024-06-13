<template>
  <fwb-modal size="md" @close="onCloseDialog">
    <template #header>
      <div class="text-lg">
        Tab name
      </div>
    </template>
    <template #body>
      <form @submit.prevent="createTab">
        <ct-components-input-text
          v-model="name"
          placeholder="11/11/23"
          required
        />
        <ct-components-button
          size="sm"
          class="mt-4"
          :disabled="!name"
          type="submit"
        >
          Create Tab
        </ct-components-button>
      </form>
    </template>
  </fwb-modal>
</template>
<script setup lang="ts">
import { FwbModal } from 'flowbite-vue'

const emit = defineEmits(['createTab', 'close'])

const name = ref('')

const createTab = () => {
  emit('createTab', name.value)
  onCloseDialog()
}

const onCloseDialog = () => {
  emit('close')
}
</script>
