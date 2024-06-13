<template>
  <div class="h-full">
    <div class="text-3xl pb-6">
      {{ patientsStore.currentPatient?.name }}
      {{ patientsStore.currentPatient?.lastName }}
    </div>
    <div class="rounded-2xl bg-white p-5 h-full">
      <ct-components-button color="tertiary" :disabled="false" @click="exportPosturesToPDF">
        Export to PDF
      </ct-components-button>
      <ct-components-button class="ml-4" @click="createTab">
        Create new tab
      </ct-components-button>
      <UTabs
        v-if="tabs.length > 0"
        v-model="activeTab"
        :items="tabs"
        class="pt-8"
        :ui="{
          list: {
            width: 'lg:max-w-3xl'
          }
        }"
      >
        <template #item="{ item }">
          <div class="grid gap-4 grid-cols-1 lg:grid-cols-2 pt-4">
            <ct-components-posture-analysis id="left" :tab-name="item.label" />
            <ct-components-posture-analysis id="right" :tab-name="item.label" />
          </div>
        </template>
      </UTabs>
      <div v-else />
    </div>
    <posture-analysis-create-tab-dialog
      v-if="showCreateTabDialog"
      @close="onCloseCreateTabDialog"
      @create-tab="onCreateTab"
    />
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import type { ComputedRef } from 'vue'
import { usePatientsStore } from '~/stores/patients'

type Tab = {
  label: string
}
const { params } = useRoute()
const patientsStore = usePatientsStore()
const router = useRouter()
const route = useRoute()

const patientId = params.id as string
const showCreateTabDialog = ref(false)
const currentPatient = computed(() => patientsStore.getPatientById(patientId))
const tabs: ComputedRef<Tab[]> = computed(() => {
  const postureAnalysis = currentPatient.value?.postureAnalysis

  return postureAnalysis
    ? Object.keys(postureAnalysis).map(tab => ({
      label: tab
    })).sort((tabA, tabB) => tabA.label.localeCompare(tabB.label))
    : []
})

const activeTab = computed({
  get () {
    const index = tabs.value.findIndex((item: Tab) => item.label === route.query.tab)
    if (index === -1) {
      return 0
    }

    return index
  },
  set (value) {
    router.replace({ query: { tab: tabs.value[value].label } })
  }
})

const exportPDFButtonDisabled = computed(() => {
  if (!activeTab.value) {
    return true
  }
  const tabName = tabs.value[activeTab.value].label
  const leftPostureData = patientsStore.getPatientPosture(tabName, 'left')
  const rightPostureData = patientsStore.getPatientPosture(tabName, 'right')
  return !leftPostureData?.imageUrl || !rightPostureData?.imageUrl
})

const getImgFromUrl = (logoUrl: string, callback: Function) => {
  const img = new Image()
  img.src = logoUrl
  img.onload = function () {
    callback(img)
  }
}

const createTab = () => {
  showCreateTabDialog.value = true
}

const onCloseCreateTabDialog = () => {
  showCreateTabDialog.value = false
}

const onCreateTab = async (tabName: string) => {
  const updatePatient = {
    postureAnalysis: {
      [tabName]: {
        left: '',
        right: ''
      }
    }
  }

  await patientsStore.updatePatient(updatePatient, patientId)
  await patientsStore.fetchPatients()
}

const exportPosturesToPDF = () => {
  useTrackEvent('export-posture-analysis-pdf')
  const tabName = tabs.value[activeTab.value].label
  const leftPostureData = patientsStore.getPatientPosture(tabName, 'left')
  const rightPostureData = patientsStore.getPatientPosture(tabName, 'right')
  getImgFromUrl(leftPostureData!.imageUrl, (img1: string) => {
    getImgFromUrl(rightPostureData!.imageUrl, async (img2: string) => {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('p', 'mm', 'a4')

      const exportCanvas = async (
        canvas: HTMLCanvasElement,
        img: string,
        xOffset: number,
        yOffset = 10
      ): Promise<void> => {
        const canvasImage = await html2canvas(canvas, { allowTaint: true, useCORS: true })
        const imageDataUrl = canvasImage.toDataURL('image/jpeg', 1.0)
        doc.addImage(img, 'JPEG', xOffset, yOffset, 90, 150)
        doc.addImage(imageDataUrl, 'JPEG', xOffset, yOffset, 90, 150)
      }

      doc.setFontSize(24)
      const titleWidth = doc.getStringUnitWidth('Análisis de la postura') * doc.getFontSize() / doc.internal.scaleFactor
      const titleXOffset = (doc.internal.pageSize.getWidth() - titleWidth) / 2
      doc.setTextColor(105, 162, 151)
      doc.text('Posture analysis', titleXOffset, 16)
      doc.setTextColor(0)
      doc.setFontSize(12)
      doc.text('Our body has a system that helps us stay balanced when we\'re standing up. This system combines information from our inner ear, our eyes, and our sense of touch. But sometimes, interferences inside our body can mess up this system and make us feel off-balance. These problems often come from the pressures and stresses we face in life. It\'s important to understand that having the right posture is really important for our body. It affects how we breathe, how our hormones work, and even how our brain functions. Knowing this, having good posture isn\'t just about looking good; it\'s about keeping your body healthy and feeling better overall. It\'s not just about standing up straight; it\'s about living a healthier life!', 10, 40, { maxWidth: 190 })

      await exportCanvas(patientsStore.currentPatient!.postureCanvas![tabName].left!, img1, 10, 90)
      await exportCanvas(patientsStore.currentPatient!.postureCanvas![tabName].right!, img2, 110, 90)

      doc.save(`postura_${patientsStore?.currentPatient?.name}_${patientsStore?.currentPatient?.lastName}.pdf`)
    })
  })
}

onMounted(() => {
  patientsStore.setCurrentPatient(patientId)
})
//
// watch(activeTab, (newTabInex) => {
//   console.log('aquiiiii')
//   console.log(newTabInex)
//   console.log(tabs)
//   const newTab = tabs[newTabInex].label
//   postureAnalysisStore.postures[newTab] = {}
// }, { immediate: true })
</script>
