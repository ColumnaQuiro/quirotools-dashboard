<template>
  <div>
    <canvas ref="blindSpotTopCanvas" width="1000" height="300" />
    <div>
      <ct-components-button ref="blindSpotTopLeftButton" color="tertiary">
        Generate Left Polygon
      </ct-components-button>
      <ct-components-button ref="blindSpotTopRightButton" color="tertiary">
        Generate Right Polygon
      </ct-components-button>
      <ct-components-button ref="blindSpotTopResetButton" color="tertiary">
        Reset
      </ct-components-button>
    </div>
    <div>
      <label>Left Polygon Area:</label>
      <span ref="blindSpotTopLeftPolygonArea" />
    </div>
    <div>
      <label>Right Polygon Area:</label>
      <span ref="blindSpotTopRightPolygonArea" />
    </div>
    <div>
      <label>Distance from Stimulus to First Dot on Left:</label>
      <span ref="blindSpotTopLeftDotDistance" />
    </div>
    <div>
      <label>Distance from Stimulus to First Dot on Right:</label>
      <span ref="blindSpotTopRightDotDistance" />
    </div>

    <canvas id="canvas" ref="blindSpotBottomCanvas" width="1000" height="300" />
    <div>
      <ct-components-button ref="blindSpotBottomLeftButton" color="tertiary">
        Generate Left Polygon
      </ct-components-button>
      <ct-components-button ref="blindSpotBottomRightButton" color="tertiary">
        Generate Right Polygon
      </ct-components-button>
      <ct-components-button ref="blindSpotBottomResetButton" color="tertiary">
        Reset
      </ct-components-button>
    </div>
    <div>
      <label>Left Polygon Area:</label>
      <span ref="blindSpotBottomLeftPolygonArea" />
    </div>
    <div>
      <label>Right Polygon Area:</label>
      <span ref="blindSpotBottomRightPolygonArea" />
    </div>
    <div>
      <label>Distance from Stimulus to First Dot on Left:</label>
      <span ref="blindSpotBottomLeftDotDistance" />
    </div>
    <div>
      <label>Distance from Stimulus to First Dot on Right:</label>
      <span ref="blindSpotBottomRightDotDistance" />
    </div>
    <button @click="exportToPDF">
      Export to PDF
    </button>
    <div>
      <label>Left area difference:</label>
      <span ref="blindSpotLeftAreaDifference" />
    </div>
    <div>
      <label>Right area difference:</label>
      <span ref="blindSpotRightAreaDifference" />
    </div>
    <div>
      <label>Left Distance deference:</label>
      <span ref="blindSpotLeftDistanceDifference" />
    </div>
    <div>
      <label>Right Distance deference:</label>
      <span ref="blindSpotRightDistanceDifference" />
    </div>
    <canvas ref="blindSpotSuperposedCanvas" width="1000" height="300" />
  </div>
</template>
<script setup lang="ts">
import { Ref } from 'vue'
import { VBtn } from 'vuetify/components'
import DualBlindSpotMappingTest from '~/models/BlindSpotMapping'

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

onMounted(() => {
  dualTest = new DualBlindSpotMappingTest(
    'blind-spot-top',
    'blind-spot-bottom',
    'rgba(255, 51, 51, 1)',
    'rgba(0, 173, 67, 1)',
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
})

const exportToPDF = async () => {
  await dualTest.exportPDF()
}
</script>
<style lang="scss" scoped>
canvas {
  border: 1px solid black;
}
</style>
