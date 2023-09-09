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
import { User } from '@firebase/auth'
import { usePatientsStore } from '~/stores/patients'
import { useChiropractorStore } from '~/stores/chiropractor'

const { push } = useRouter()
const patientsStore = usePatientsStore()
const chiropractorStore = useChiropractorStore()

const sidePanelExpanded: Ref<boolean> = ref(false)

const toggleSidePanelExpansion = (isExpanded: boolean) => {
  sidePanelExpanded.value = isExpanded
}

const isUserInFreeTrial = (user: User) => {
  const sevenDaysUserTimestamp = user?.metadata?.creationTime && new Date(user.metadata.creationTime).getTime() + (7 * 24 * 60 * 60 * 1000)
  if (!sevenDaysUserTimestamp) {
    return false
  }
  return sevenDaysUserTimestamp > Date.now()
}

await chiropractorStore.fetchChiropractor()
await patientsStore.fetchPatients()

onMounted(async () => {
  const user: User = await getCurrentUser()

  if (!isUserInFreeTrial(user) && chiropractorStore?.chiropractor && !chiropractorStore.chiropractor?.hasPaid) {
    return push('/create-subscription')
  }
})
</script>
<style lang="scss">
.layout__content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
