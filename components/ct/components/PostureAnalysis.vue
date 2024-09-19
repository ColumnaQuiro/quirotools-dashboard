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
      <fwb-file-input
        v-else
        :dropzone="true"
        class="posture-analysis__file-input"
        @update:model-value="handleFileUpload"
      >
        <p class="!mt-1 text-xs text-gray-500 dark:text-gray-400">
          SVG, PNG, JPG or GIF
        </p>
      </fwb-file-input>
    </div>
    <div class="flex flex-row items-center">
      <ct-components-button
        :disabled="verticalDots.length < 2 || verticalLineFinished"
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
      <UIcon
        name="i-heroicons-x-circle-16-solid"
        class="block text-3xl text-brand-red cursor-pointer"
        @click="clearState"
      />
      <fwb-spinner v-if="uploadingImage" size="12" color="green" />
    </div>
  </div>
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { getCurrentUser } from 'vuefire'
import { type PropType, type Ref } from 'vue'
import { FwbFileInput, FwbSpinner } from 'flowbite-vue'
import { usePatientsStore } from '~/stores/patients'
import { type PostureAnalysisState, type Patient, type Position, type PostureAnalysisKey } from '~/types/patient'
import { useFireBaseStorage } from '~/composables/storage'
import { type PostureKey } from '~/stores/postureAnalysis'

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
    type: String as PropType<PostureAnalysisKey>,
    required: true
  },
  tabName: {
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
    // Retry logic
    let attempts = 0
    const maxAttempts = 10 // Maximum retry attempts
    const retryDelay = 500 // Delay between retries in ms

    while (attempts < maxAttempts && !fileData.url.value) {
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      attempts++
      console.log(`Retrying to get file URL, attempt: ${attempts}`)
    }

    if (fileData.url.value) {
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
    } else {
      throw new Error('Failed to obtain file URL after maximum attempts')
    }
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
  const patientStore = usePatientsStore()
  if (!imageUrl.value || !patientStore.currentPatient) {
    return
  }
  const state: PostureAnalysisState = {
    imageUrl: imageUrl.value,
    verticalDots,
    horizontalDots,
    horizontalPairs,
    canvasDataUrl: canvasRef.value?.toDataURL('image/jpeg', 1.0) || ''
  }

  if (!patientStore.currentPatient.postureCanvas) {
    patientStore.currentPatient.postureCanvas = {}
  }

  if (!patientStore.currentPatient.postureCanvas[props.tabName]) {
    patientStore.currentPatient.postureCanvas[props.tabName] = {}
  }

  patientStore.currentPatient!.postureCanvas[props.tabName][props.id as PostureKey] = canvasRef.value

  if (!patientStore.currentPatient.postureAnalysis) {
    patientStore.currentPatient.postureAnalysis = {}
  }

  if (!patientStore.currentPatient.postureAnalysis[props.tabName]) {
    patientStore.currentPatient.postureAnalysis[props.tabName] = {}
  }

  patientStore.currentPatient.postureAnalysis[props.tabName][props.id as PostureAnalysisKey] = JSON.stringify(state)

  const patientStateUpdated: Partial<Patient> = {
    postureAnalysis: {
      [props.tabName]: {
        [props.id as PostureAnalysisKey]: JSON.stringify(state)
      }
    }
  }
  const patientsStore = usePatientsStore()
  patientsStore.updatePatient(patientStateUpdated)
  // patientsStore.fetchPatients()
}

// Function to load the state from localStorage
const loadStateFromLocalStorage = () => {
  const patientsStore = usePatientsStore()
  const savedState = patientsStore.getPatientPosture(props.tabName, props.id)
  if (savedState) {
    imageUrl.value = savedState.imageUrl
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
    image.src = savedState.imageUrl
    verticalDots.splice(0, verticalDots.length, ...savedState.verticalDots)
    horizontalDots.splice(0, horizontalDots.length, ...savedState.horizontalDots)
    horizontalPairs.splice(0, horizontalPairs.length, ...savedState.horizontalPairs)
  }
}

const clearState = () => {
  verticalDots.length = 0
  horizontalDots.length = 0
  horizontalPairs.length = 0
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
