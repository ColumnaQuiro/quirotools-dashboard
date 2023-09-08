<template>
  <div ref="sidePanelRef" :class="{ 'w-60': isOpen, 'w-14': !isOpen }" class="side-panel fixed h-full bg-white pb-6">
    <!--    <ct-components-button icon variant="plain" color="black" class="p-4" @click="toggleSidePanel">-->
    <!--      <v-icon>mdi-menu</v-icon>-->
    <!--    </ct-components-button>-->
    <div class="flex flex-col justify-between h-full">
      <div>
        <div class="py-4 mx-2 border-b">
          <v-img :src="`${STATICS_CDN}logo/icon-color.webp`" :width="35" alt="ColumnaQuiro" class="mx-auto" />
        </div>
        <transition name="slide">
          <ul class="space-y-1">
            <li v-for="(item, index) in menuItems" :key="index" class="p-4">
              <nuxt-link :to="item.link">
                <v-icon>{{ item.icon }}</v-icon>
              </nuxt-link>
            </li>
          </ul>
        </transition>
      </div>
      <ct-components-button icon variant="plain" color="black" class="mx-auto" @click="logout">
        <v-icon>mdi-logout</v-icon>
      </ct-components-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { getAuth, signOut } from '@firebase/auth'
import { useSidePanelStore } from '~/stores/sidePanel'
import { STATICS_CDN } from '~/constants/urls'

const emit = defineEmits<{
  (e: 'sidePanelExpanded', value: boolean): void
}>()

const sidePanelRef: Ref<HTMLElement | null> = ref(null)
const menuItems = [
  { icon: 'mdi-account-group', link: '/' }
]

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
  const { push } = useRouter()
  await signOut(auth)
  await push({ path: '/login' })
}
onMounted(() => {
  setSidePanelWidth()
})
</script>

<style>
.side-panel {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter {
  opacity: 0;
}

.slide-enter-to {
  opacity: 1;
}

.slide-leave {
  opacity: 1;
}

.slide-leave-to {
  opacity: 0;
}
</style>
