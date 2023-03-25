<template>
  <div>
    <canvas id="canvas" width="1000" height="300" />
    <div>
      <button id="left-button">
        Generate Left Polygon
      </button>
      <button id="right-button">
        Generate Right Polygon
      </button>
      <button id="reset-button">
        Reset
      </button>
    </div>
    <div>
      <label>Left Polygon Area:</label>
      <span id="left-area" />
    </div>
    <div>
      <label>Right Polygon Area:</label>
      <span id="right-area" />
    </div>
    <div>
      <label>Distance from Stimulus to First Dot on Left:</label>
      <span id="left-distance" />
    </div>
    <div>
      <label>Distance from Stimulus to First Dot on Right:</label>
      <span id="right-distance" />
    </div>
  </div>
</template>
<script setup lang="ts">
import BlindSpotMapping from '~/models/BlindSpotMapping'

onMounted(() => {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement
  const blindSpotMappingTest = new BlindSpotMapping(canvas)
  blindSpotMappingTest.drawStimulus()
})
</script>
<style lang="scss" scoped>
#canvas {
  border: 1px solid black;
}
</style>
