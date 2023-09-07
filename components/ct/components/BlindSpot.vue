<template>
  <div>
    <div class="text-2xl font-semibold text-center pb-8">
      BlindSpot
    </div>
    <div class="relative">
      <div class="absolute top-5 left-5 font-semibold text-gray-400">
        Before
      </div>
      <canvas ref="blindSpotTopCanvas" height="600" class="bg-white rounded-2xl mb-6" />
      <div class="absolute bottom-5 left-5">
        <div ref="blindSpotTopLeftPolygonArea" class="text-sm" />
        <div ref="blindSpotTopLeftDotDistance" class="text-sm" />
      </div>
      <div class="absolute bottom-5 right-5">
        <div ref="blindSpotTopRightPolygonArea" class="text-sm" />
        <div ref="blindSpotTopRightDotDistance" class="text-sm" />
      </div>
    </div>
    <div>
      <ct-components-button ref="blindSpotTopLeftButton" color="secondary">
        Generate Left Polygon
      </ct-components-button>
      <ct-components-button ref="blindSpotTopRightButton" class="mx-3" color="secondary">
        Generate Right Polygon
      </ct-components-button>
      <ct-components-button
        ref="blindSpotTopResetButton"
        icon
        size="small"
        variant="flat"
        color="tertiary"
        class="mr-3"
      >
        <v-icon>mdi-eraser</v-icon>
      </ct-components-button>
    </div>

    <div class="relative mt-24">
      <div class="absolute top-5 left-5 font-semibold text-gray-400">
        After
      </div>
      <canvas ref="blindSpotBottomCanvas" height="600" class="bg-white rounded-2xl mb-6" />
      <div class="absolute bottom-5 left-5">
        <div ref="blindSpotBottomLeftPolygonArea" class="text-sm" />
        <div ref="blindSpotBottomLeftDotDistance" class="text-sm" />
      </div>
      <div class="absolute bottom-5 right-5">
        <div ref="blindSpotBottomRightPolygonArea" class="text-sm" />
        <div ref="blindSpotBottomRightDotDistance" class="text-sm" />
      </div>
    </div>
    <div>
      <ct-components-button ref="blindSpotBottomLeftButton" color="secondary">
        Generate Left Polygon
      </ct-components-button>
      <ct-components-button ref="blindSpotBottomRightButton" class="mx-3" color="secondary">
        Generate Right Polygon
      </ct-components-button>
      <ct-components-button ref="blindSpotBottomResetButton" color="quaternary">
        Reset
      </ct-components-button>
    </div>
    <div class="relative mt-10">
      <div class="absolute top-5 left-5 font-semibold text-gray-400">
        Comparison
      </div>
      <canvas ref="blindSpotSuperposedCanvas" height="600" class="bg-white rounded-2xl mb-6" />
      <div class="absolute bottom-5 left-5">
        <div ref="blindSpotLeftAreaDifference" class="text-sm" />
        <div ref="blindSpotLeftDistanceDifference" class="text-sm" />
      </div>
      <div class="absolute bottom-5 right-5">
        <div ref="blindSpotRightAreaDifference" class="text-sm" />
        <div ref="blindSpotRightDistanceDifference" class="text-sm" />
      </div>
    </div>
    <ct-components-button color="tertiary" size="large" @click="exportToPDF">
      Export to PDF
    </ct-components-button>
  </div>
</template>
<script setup lang="ts">
import { Ref } from 'vue'
import { VBtn } from 'vuetify/components'
import { storeToRefs } from 'pinia'
import DualBlindSpotMappingTest from '~/models/BlindSpotMapping'
import { useSidePanelStore } from '~/stores/sidePanel'

const blindSpotTopCanvas: Ref<HTMLCanvasElement | null> = ref(null)
const blindSpotTopLeftButton: Ref<VBtn | null> = ref(null)
const blindSpotTopRightButton: Ref<VBtn | null> = ref(null)
const blindSpotTopResetButton: Ref<VBtn | null> = ref(null)
const blindSpotTopLeftPolygonArea: Ref<HTMLElement | null> = ref(null)
const blindSpotTopRightPolygonArea: Ref<HTMLElement | null> = ref(null)
const blindSpotTopLeftDotDistance: Ref<HTMLElement | null> = ref(null)
const blindSpotTopRightDotDistance: Ref<HTMLElement | null> = ref(null)

const blindSpotBottomCanvas: Ref<HTMLCanvasElement | null> = ref(null)
const blindSpotBottomLeftButton: Ref<VBtn | null> = ref(null)
const blindSpotBottomRightButton: Ref<VBtn | null> = ref(null)
const blindSpotBottomResetButton: Ref<VBtn | null> = ref(null)
const blindSpotBottomLeftPolygonArea: Ref<HTMLElement | null> = ref(null)
const blindSpotBottomRightPolygonArea: Ref<HTMLElement | null> = ref(null)
const blindSpotBottomLeftDotDistance: Ref<HTMLElement | null> = ref(null)
const blindSpotBottomRightDotDistance: Ref<HTMLElement | null> = ref(null)

const blindSpotLeftAreaDifference: Ref<HTMLElement | null> = ref(null)
const blindSpotRightAreaDifference: Ref<HTMLElement | null> = ref(null)
const blindSpotLeftDistanceDifference: Ref<HTMLElement | null> = ref(null)
const blindSpotRightDistanceDifference: Ref<HTMLElement | null> = ref(null)
const blindSpotSuperposedCanvas: Ref<HTMLCanvasElement | null> = ref(null)

let dualTest:DualBlindSpotMappingTest

const { sidePanelWidth } = storeToRefs(useSidePanelStore())

const initDualBlindSpotMappingTest = () => {
  if (!blindSpotTopCanvas.value || !blindSpotBottomCanvas.value || !blindSpotSuperposedCanvas.value) {
    return
  }
  dualTest = new DualBlindSpotMappingTest(
    'top',
    'bottom',
    '#F2B880',
    '#69A297',
      blindSpotTopCanvas.value as HTMLCanvasElement,
      blindSpotBottomCanvas.value as HTMLCanvasElement,
      blindSpotTopLeftButton.value?.$el as HTMLElement,
      blindSpotBottomLeftButton.value?.$el as HTMLElement,
      blindSpotTopRightButton.value?.$el as HTMLElement,
      blindSpotBottomRightButton.value?.$el as HTMLElement,
      blindSpotTopResetButton.value?.$el as HTMLElement,
      blindSpotBottomResetButton.value?.$el as HTMLElement,
      blindSpotTopLeftPolygonArea.value as HTMLElement,
      blindSpotTopRightPolygonArea.value as HTMLElement,
      blindSpotTopLeftDotDistance.value as HTMLElement,
      blindSpotTopRightDotDistance.value as HTMLElement,
      blindSpotBottomLeftPolygonArea.value as HTMLElement,
      blindSpotBottomRightPolygonArea.value as HTMLElement,
      blindSpotBottomLeftDotDistance.value as HTMLElement,
      blindSpotBottomRightDotDistance.value as HTMLElement,
      blindSpotLeftAreaDifference.value as HTMLElement,
      blindSpotRightAreaDifference.value as HTMLElement,
      blindSpotLeftDistanceDifference.value as HTMLElement,
      blindSpotRightDistanceDifference.value as HTMLElement,
      blindSpotSuperposedCanvas.value as HTMLCanvasElement
  )
}
onMounted(() => {
  setCanvasWidth()
  nextTick(() => initDualBlindSpotMappingTest())
})

const setCanvasWidth = () => {
  if (blindSpotTopCanvas.value && blindSpotBottomCanvas.value && blindSpotSuperposedCanvas.value) {
    blindSpotTopCanvas.value.width = window.outerWidth - sidePanelWidth?.value - 32
    blindSpotBottomCanvas.value.width = window.outerWidth - sidePanelWidth?.value - 32
    blindSpotSuperposedCanvas.value.width = window.outerWidth - sidePanelWidth?.value - 32
  }
}
const exportToPDF = async () => {
  await dualTest.exportPDF()
}
</script>
<style lang="scss" scoped>
canvas {
}
</style>
