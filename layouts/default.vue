<template>
  <div class="layout min-h-screen bg-gray-50">
    <div class="flex flex-row">
      <ct-layouts-side-panel @side-panel-expanded="toggleSidePanelExpansion" />
      <div
        class="layout__content pt-10 w-full pr-4"
        :class="{
          'pl-[256px]': sidePanelExpanded,
          'pl-[72px]': !sidePanelExpanded
        }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Ref } from 'vue'
import { usePatientsStore } from '~/stores/patients'
import { useChiropractorStore } from '~/stores/chiropractor'

const patientsStore = usePatientsStore()
const chiropractorStore = useChiropractorStore()
await chiropractorStore.fetchChiropractor()
await patientsStore.fetchPatients()

const sidePanelExpanded: Ref<boolean> = ref(false)

const toggleSidePanelExpansion = (isExpanded: boolean) => {
  sidePanelExpanded.value = isExpanded
}
</script>
<style lang="scss">
.layout__content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
