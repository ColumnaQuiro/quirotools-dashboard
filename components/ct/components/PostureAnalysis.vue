<template>
  <div class="canvas-container">
    <div class="canvas-wrapper">
      <!--      <img v-if="imageUrl" id="imageId" ref="imageRef" :src="imageUrl" class="canvas-image">-->
      <canvas
        ref="canvasRef"
        class="canvas"
        width="465"
        height="700"
        @click="handleCanvasClick"
      />
    </div>
    <div class="flex flex-row">
      <v-file-input
        :clearable="false"
        variant="solo-filled"
        prepend-inner-icon="mdi-camera"
        prepend-icon=""
        :hide-details="true"
        base-color="secondary"
        bg-color="secondary"
        color="secondary"
        :flat="true"
        density="compact"
        :rounded="true"
        :single-line="true"
        :loading="uploadingImage"
        class="mr-3"
        @update:model-value="handleFileUpload"
      />
      <ct-components-button
        :disabled="verticalDots.length < 2"
        class="mr-3"
        color="secondary"
        @click="drawLine"
      >
        Draw Y-axis
      </ct-components-button>
      <ct-components-button
        class="mr-3"
        color="secondary"
        :disabled="horizontalDots.length < 2"
        @click="drawHorizontalLines"
      >
        Draw Horizontal Lines
      </ct-components-button>
      <ct-components-button
        icon
        size="small"
        variant="flat"
        color="tertiary"
        class="mr-3"
        @click="clearState"
      >
        <v-icon>mdi-eraser</v-icon>
      </ct-components-button>
      <v-progress-circular
        v-if="uploadingImage"
        indeterminate
        color="secondary"
        class="mt-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { getCurrentUser } from 'vuefire'
import { Ref } from 'vue'
import { usePatientsStore } from '~/stores/patients'
import { BackPositionState, Patient, Position } from '~/types/patient'
import { useFireBaseStorage } from '~/composables/storage'
import { PostureKey, usePostureAnalysisStore } from '~/stores/postureAnalysis'

const firebaseStorage = useFireBaseStorage()
const patientsStore = usePatientsStore()
const canvasRef: Ref<HTMLCanvasElement | null> = ref(null)
const ctxRef = ref(null)
const imageRef = ref(null)
const imageUrl = ref(null)
const imageDataString = ref(null)
const verticalLineFinished = ref(false)
const uploadingImage = ref(false)
const verticalDots: Position[] = reactive([])
const horizontalDots: Position[] = reactive([])
const horizontalPairs: Position[] = reactive([])
const enableHorizontalLines = ref(false)
const { currentPatient } = storeToRefs(patientsStore)

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const drawDot = (x: number, y: number) => {
  const ctx = canvasRef.value.getContext('2d')
  ctx.fillStyle = 'red'
  ctx.beginPath()
  ctx.arc(x, y, 3, 0, Math.PI * 2)
  ctx.fill()
}

const handleCanvasClick = (event) => {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  if (verticalLineFinished.value) {
    drawDot(x, y)
    horizontalDots.push({ x, y })

    if (horizontalDots.length % 2 === 0) {
      const pair = [horizontalDots[horizontalDots.length - 2], horizontalDots[horizontalDots.length - 1]]
      horizontalPairs.push(pair)
    }
  } else {
    drawDot(x, y)
    verticalDots.push({ x, y })
  }
}

const drawLine = () => {
  const ctx = canvasRef.value.getContext('2d')
  ctx.strokeStyle = '#f2b880'
  ctx.lineWidth = 2
  ctx.beginPath()

  if (verticalDots.length > 0) {
    const firstDot = verticalDots[0]
    ctx.moveTo(firstDot.x, firstDot.y)

    for (let i = 1; i < verticalDots.length; i++) {
      const dot = verticalDots[i]
      ctx.lineTo(dot.x, dot.y)
    }
    verticalLineFinished.value = true
  }

  ctx.stroke()
}

const handleFileUpload = (files: File[]) => {
  uploadingImage.value = true
  const file = files[0]
  const reader = new FileReader()
  reader.onload = async (e) => {
    const currentUser = await getCurrentUser()
    const imageExt = file.type.split('/')[1]
    const imagePath = `back-position/${currentUser?.uid}/${currentPatient.value.uid}/${props.id}.${imageExt}`
    const fileData = firebaseStorage.prepareUploadFile(imagePath)
    await fileData.upload(file)
    uploadingImage.value = false
    imageUrl.value = fileData.url.value
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      clearState()
      const canvas = canvasRef.value
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, canvas?.width, canvas?.height)
      ctx.lineWidth = 2
      ctxRef.value = ctx
    }
    image.src = e.target.result
  }
  reader.readAsDataURL(file)
}

const calculateVerticalLineDegree = (dot1: Position, dot2: Position) => {
  const deltaY = dot2.y - dot1.y
  const deltaX = dot2.x - dot1.x
  const radians = Math.atan2(deltaY, deltaX)
  const degrees = radians * (180 / Math.PI)
  return degrees.toFixed(2)
}

const calculateHorizontalLineDegree = (dot1: Position, dot2: Position) => {
  const deltaY = dot2.y - dot1.y
  const deltaX = dot2.x - dot1.x
  const radians = Math.atan2(deltaY, deltaX)
  const degrees = radians * (180 / Math.PI)

  // Calculate the angle between the horizontal line and the vertical line
  const verticalAngle = Math.atan2(1, 0)
  const horizontalAngle = Math.atan2(deltaY, deltaX)
  const variation = (verticalAngle - horizontalAngle) * (180 / Math.PI) - degrees

  return variation.toFixed(2)
}

const drawDegreeText = (dot: Position, variation: number, isHorizontal: boolean) => {
  const ctx = canvasRef.value.getContext('2d')
  ctx.font = '12px Arial'
  ctx.fillStyle = 'black'

  const padding = 10
  const containerColor = '#ffffff'

  let textX, textY

  if (isHorizontal) {
    textX = dot.x + padding
    textY = dot.y
  } else {
    textX = dot.x
    textY = dot.y - padding
  }

  const degreeText = `${Math.abs(variation).toFixed(2)}°`
  const degreeTextWidth = ctx.measureText(degreeText).width

  const containerWidth = degreeTextWidth + 2 * padding
  const containerHeight = 20
  const containerX = textX - padding
  const containerY = textY - containerHeight

  ctx.fillStyle = containerColor
  ctx.fillRect(containerX, containerY, containerWidth, containerHeight)

  ctx.fillStyle = 'black'
  ctx.fillText(degreeText, containerX + padding, containerY + containerHeight - 5)

  if (isHorizontal) {
    const degreesToCms = Math.abs(variation * 0.1).toFixed(2)
    const cmsText = `${degreesToCms} cm`
    const cmsTextWidth = ctx.measureText(cmsText).width

    const cmsContainerWidth = cmsTextWidth + 2 * padding
    const cmsContainerX = textX - padding
    const cmsContainerY = textY + padding

    ctx.fillStyle = containerColor
    ctx.fillRect(cmsContainerX, cmsContainerY, cmsContainerWidth, containerHeight)

    ctx.fillStyle = 'black'
    ctx.fillText(cmsText, containerX + padding, cmsContainerY + containerHeight - 5)
  }
}

const drawHorizontalLines = () => {
  const ctx = canvasRef.value.getContext('2d')
  ctx.strokeStyle = '#8d5b4c'
  ctx.lineWidth = 2
  ctx.beginPath()

  for (const pair of horizontalPairs) {
    const dot1 = pair[0]
    const dot2 = pair[1]
    ctx.moveTo(dot1.x, dot1.y)
    ctx.lineTo(dot2.x, dot2.y)

    const verticalLineDegree = calculateVerticalLineDegree(dot1, dot2)
    const horizontalLineDegree = calculateHorizontalLineDegree(dot1, dot2)
    drawDegreeText(dot2, verticalLineDegree, true)
  }

  ctx.stroke()
}

const saveStateToLocalStorage = () => {
  if (!imageUrl.value) {
    return
  }
  const state: BackPositionState = {
    imageUrl: imageUrl.value,
    verticalDots,
    horizontalDots,
    horizontalPairs
  }
  const postureAnalysisStore = usePostureAnalysisStore()
  postureAnalysisStore.postures[props.id as PostureKey] = {
    canvas: canvasRef.value,
    imageUrl: imageUrl.value
  }

  const patientStateUpdated: Partial<Patient> = {
    backPosition: {
      [props.id]: JSON.stringify(state)
    }
  }
  const patientsStore = usePatientsStore()
  patientsStore.updatePatient(patientStateUpdated)
}

// Function to load the state from localStorage
const loadStateFromLocalStorage = () => {
  const patientsStore = usePatientsStore()
  const { currentPatient } = storeToRefs(patientsStore)
  const savedState = currentPatient.value?.backPosition?.[props.id]
  if (savedState) {
    const backPositionState: BackPositionState = JSON.parse(savedState)
    imageUrl.value = backPositionState.imageUrl
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const canvas = canvasRef.value
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, canvas?.width, canvas?.height)
      ctx.lineWidth = 2
      ctxRef.value = ctx
      verticalDots.forEach(dot => drawDot(dot.x, dot.y))
      horizontalDots.forEach(dot => drawDot(dot.x, dot.y))
      drawLine()
      drawHorizontalLines()
    }
    image.src = backPositionState.imageUrl
    verticalDots.splice(0, verticalDots.length, ...backPositionState.verticalDots)
    horizontalDots.splice(0, horizontalDots.length, ...backPositionState.horizontalDots)
    horizontalPairs.splice(0, horizontalPairs.length, ...backPositionState.horizontalPairs)
  }
}

const clearState = () => {
  verticalDots.splice(0, verticalDots.length)
  horizontalDots.splice(0, horizontalDots.length)
  horizontalPairs.splice(0, horizontalPairs.length)
  canvasRef.value?.getContext('2d')?.clearRect(0, 0, canvasRef.value?.width, canvasRef.value?.height)
}

onMounted(() => {
  nextTick(() => loadStateFromLocalStorage())
})

// Save the state to localStorage when there are changes
watchEffect(() => {
  saveStateToLocalStorage()
})
</script>

<style lang="scss">
.v-input, .v-input__control {
  @apply inline-flex w-[45px] max-w-[45px] max-h-[36px];
}

.v-input {
  .v-icon {
    font-size: 21px;
  }

  .v-field__input {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
$canvas-width: 465px;

.canvas-container {
  position: relative;
  height: 900px;
}

.canvas-wrapper {
  position: relative;
  width: $canvas-width;
}

.canvas-image {
  position: absolute;
  top: 80px;
  left: 0;
  pointer-events: none;
  width: $canvas-width;
  height: 700px;
  object-fit: cover;
}

.canvas {
  position: absolute;
  top: 80px;
  left: 0;
  border: 1px solid #000000;
}

.toggle-button {
  margin-top: 10px;
}
</style>
