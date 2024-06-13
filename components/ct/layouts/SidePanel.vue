<template>
  <div ref="sidePanelRef" :class="{ 'w-60': isOpen, 'w-14': !isOpen }" class="side-panel fixed h-full bg-white pb-6">
    <div class="flex flex-col justify-between h-full">
      <div>
        <div class="py-4">
          <img :src="`${STATICS_CDN}chiro-tools/logo/icon-color.webp`" :width="45" alt="Chirotools" class="mx-auto">
        </div>
        <transition name="slide">
          <ul class="space-y-1 border-t mx-2">
            <li class="py-4 px-2">
              <nuxt-link to="/">
                <svg class="w-[20px] h-[20px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                </svg>
              </nuxt-link>
            </li>
          </ul>
        </transition>
      </div>
      <nuxt-link
        tag="router-link"
        class="mx-auto"
        to="/login"
        @click="logout"
      >
        <svg class="w-[20px] h-[20px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
          <path stroke="#ababab" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3" />
        </svg>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { getAuth, signOut } from '@firebase/auth'
import { useSidePanelStore } from '~/stores/sidePanel'
import { STATICS_CDN } from '~/constants/urls'

const emit = defineEmits<{
  (e: 'sidePanelExpanded', value: boolean): void
}>()

const sidePanelRef: Ref<HTMLElement | null> = ref(null)

const isOpen = ref(false)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toggleSidePanel = () => {
  isOpen.value = !isOpen.value
  emit('sidePanelExpanded', isOpen.value)
  setTimeout(() => setSidePanelWidth(), 300)
}

const setSidePanelWidth = () => {
  const { sidePanelWidth } = storeToRefs(useSidePanelStore())
  sidePanelWidth.value = sidePanelRef.value?.offsetWidth || 0
}

const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  useTrackEvent('logout')
}
onMounted(() => {
  setSidePanelWidth()
})
</script>
<style lang="scss">
.side-panel {}
</style>
