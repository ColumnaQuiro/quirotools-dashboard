<template>
  <div>
    <div class="text-3xl pb-6">
      {{ currentPatient?.name }}
      {{ currentPatient?.lastName }}
    </div>
    <ct-components-button variant="flat" color="tertiary" @click="exportPosturesToPDF">
      Export to PDF
    </ct-components-button>
    <div class="grid gap-4 grid-cols-1 lg:grid-cols-2 pt-8">
      <ct-components-posture-analysis id="left" />
      <ct-components-posture-analysis id="right" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { usePatientsStore } from '~/stores/patients'
import { usePostureAnalysisStore } from '~/stores/postureAnalysis'

const { params } = useRoute()
const patientId = params.id as string
const patientsStore = usePatientsStore()
const { currentPatient } = storeToRefs(patientsStore)

const getImgFromUrl = (logoUrl: string, callback: Function) => {
  const img = new Image()
  img.src = logoUrl
  img.onload = function () {
    callback(img)
  }
}

const exportPosturesToPDF = () => {
  const postureAnalysisStore = usePostureAnalysisStore()

  getImgFromUrl(postureAnalysisStore.postures?.left?.imageUrl, (img1: string) => {
    getImgFromUrl(postureAnalysisStore.postures?.left?.imageUrl, async (img2: string) => {
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
      doc.text('Análisis de lapostura', titleXOffset, 16)
      doc.setTextColor(0)
      doc.setFontSize(12)
      doc.text('Tu postura afecta y modera cada función fisiologica, desde la respiración hasta la producción hormonal.\nEl estrés crea tensiones, bloqueos y desequilibrios en tu cuerpo y postura.\nTener una buena postura es un signo de buena salud.', 10, 40)

      await exportCanvas(postureAnalysisStore.postures?.left?.canvas, img1, 10, 70)
      await exportCanvas(postureAnalysisStore.postures?.right?.canvas, img2, 110, 70)

      doc.save(`postura_${currentPatient.value.name}_${currentPatient.value.lastName}.pdf`)
    })
  })
}
onMounted(() => {
  patientsStore.setCurrentPatient(patientId)
})
</script>
