<template>
  <div class="posture-analysis">
    <div class="posture-analysis__canvas-wrapper">
      <canvas
        v-if="imageUrl"
        ref="canvasRef"
        class="posture-analysis__canvas"
        width="465"
        height="700"
        @click="handleCanvasClick"
      />
      <fwb-file-input v-else :dropzone="true" class="posture-analysis__file-input" @update:model-value="handleFileUpload">
        <p class="!mt-1 text-xs text-gray-500 dark:text-gray-400">
          SVG, PNG, JPG or GIF
        </p>
      </fwb-file-input>
    </div>
    <div class="flex flex-row">
      <ct-components-button
        :disabled="verticalDots.length < 2"
        class="mr-3"
        @click="drawLine"
      >
        Draw Y-axis
      </ct-components-button>
      <ct-components-button
        class="mr-3"
        :disabled="horizontalDots.length < 2"
        @click="drawHorizontalLines"
      >
        Draw Horizontal Lines
      </ct-components-button>
      <ct-components-button
        size="sm"
        class="mr-3 !rounded-3xl"
        @click="clearState"
      >
        <svg class="w-[20px] h-[20px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z" />
        </svg>
      </ct-components-button>
      <fwb-spinner v-if="uploadingImage" size="12" color="green" />
    </div>
  </div>
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { getCurrentUser } from 'vuefire'
import { PropType, Ref } from 'vue'
import { FwbFileInput, FwbSpinner } from 'flowbite-vue'
import { usePatientsStore } from '~/stores/patients'
import { BackPositionState, Patient, Position } from '~/types/patient'
import { useFireBaseStorage } from '~/composables/storage'
import { PostureKey, usePostureAnalysisStore } from '~/stores/postureAnalysis'

const firebaseStorage = useFireBaseStorage()
const patientsStore = usePatientsStore()
const canvasRef: Ref<HTMLCanvasElement | undefined> = ref()
const ctxRef: Ref<CanvasRenderingContext2D | undefined> = ref()
const imageUrl: Ref<string | null | undefined> = ref()
const verticalLineFinished = ref(false)
const uploadingImage = ref(false)
const verticalDots: Position[] = reactive([])
const horizontalDots: Position[] = reactive([])
const horizontalPairs: Position[][] = reactive([])
const { currentPatient } = storeToRefs(patientsStore)

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const drawDot = (x: number, y: number) => {
  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) {
    ctx.fillStyle = 'red'
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fill()
  }
}

const handleCanvasClick = (event: MouseEvent) => {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }
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
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) {
    return
  }

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

const handleFileUpload = (file: File) => {
  uploadingImage.value = true
  const reader = new FileReader()
  reader.onload = async (e) => {
    const currentUser = await getCurrentUser()
    const imageExt = file.type.split('/')[1]
    const imagePath = `back-position/${currentUser?.uid}/${currentPatient?.value?.uid}/${props.id}.${imageExt}`
    const fileData = firebaseStorage.prepareUploadFile(imagePath)
    await fileData.upload(file)
    uploadingImage.value = false
    imageUrl.value = fileData.url.value
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const canvas = canvasRef.value
      const ctx = canvas?.getContext('2d')
      if (ctx && canvas) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        ctx.lineWidth = 2
        ctxRef.value = ctx
        saveStateToLocalStorage()
      }
    }
    image.src = e.target?.result as string || ''
  }
  reader.readAsDataURL(file)
}

const calculateVerticalLineDegree = (dot1: Position, dot2: Position) => {
  const deltaY = dot2.y - dot1.y
  const deltaX = dot2.x - dot1.x
  const radians = Math.atan2(deltaY, deltaX)
  return radians * (180 / Math.PI)
}

const drawDegreeText = (dot: Position, variation: number, isHorizontal: boolean) => {
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) {
    return
  }

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
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) {
    return
  }
  ctx.strokeStyle = '#8d5b4c'
  ctx.lineWidth = 2
  ctx.beginPath()

  for (const pair of horizontalPairs) {
    const dot1 = pair[0]
    const dot2 = pair[1]
    ctx.moveTo(dot1.x, dot1.y)
    ctx.lineTo(dot2.x, dot2.y)

    const verticalLineDegree = calculateVerticalLineDegree(dot1, dot2)
    // const horizontalLineDegree = calculateHorizontalLineDegree(dot1, dot2)
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
  const savedState = patientsStore.currentPatient?.backPosition?.[props.id]
  if (savedState) {
    const backPositionState: BackPositionState = JSON.parse(savedState)
    imageUrl.value = backPositionState.imageUrl
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const canvas = canvasRef.value
      const ctx = canvas?.getContext('2d')
      if (ctx) {
        ctx.drawImage(image, 0, 0, canvas!.width, canvas!.height)
        ctx.lineWidth = 2
        ctxRef.value = ctx
        verticalDots.forEach(dot => drawDot(dot.x, dot.y))
        horizontalDots.forEach(dot => drawDot(dot.x, dot.y))
        drawLine()
        drawHorizontalLines()
      }
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
  imageUrl.value = undefined
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
<style lang="scss">
$canvas-width: 465px;

.posture-analysis {
  position: relative;
  height: 900px;

  &__canvas-wrapper {
    position: relative;
    width: $canvas-width;
  }

  &__canvas {
    position: absolute;
    top: 80px;
    left: 0;
    border: 1px solid #ababab;
    border-radius: 8px;
  }

  &__file-input {
    position: absolute;
    top: 80px;
    left: 0;
    width: 465px;
    height: 700px;

    div:nth-child(1) {
      @apply h-full;
    }

    label {
      @apply h-full;
    }
  }
}
</style>
