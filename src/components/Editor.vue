<template>
  <div class="editor-container">
    <div class="editorial-header">
      <span class="chapter-num">{{ t('step_02') }}</span>
      <h2 class="giant-heading" v-html="t('heading_edit')"></h2>
    </div>

    <div class="cropper-section">
      <div class="cropper-wrapper">
        <div class="canvas-container" ref="canvasContainer">
          <!-- Cropper JS Image -->
          <img ref="imageElement" :src="imageUrl" alt="Source" class="source-image" />
          
          <!-- The Frame Overlay -->
          <img 
            src="../assets/deng.png" 
            alt="Frame Overlay" 
            class="frame-overlay"
            draggable="false"
          />
        </div>
      </div>
      
      <!-- Precision Zoom Slider -->
      <div class="zoom-controls">
        <span class="zoom-label">[ {{ t('zoom') }} ]</span>
        <input 
          type="range" 
          min="0.01" 
          max="10" 
          step="0.01" 
          v-model="zoomValue" 
          @input="onZoomChange"
          class="zoom-slider"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import Cropper from 'cropperjs'

const { t } = useI18n()

const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['cropper-ready'])

const imageElement = ref(null)
const cropper = ref(null)
const zoomValue = ref(1)

onMounted(() => {
  if (imageElement.value) {
    cropper.value = new Cropper(imageElement.value, {
      viewMode: 0,
      dragMode: 'move',
      aspectRatio: 1, // Frame is a perfect square
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      toggleDragModeOnDblclick: false,
      background: false,
      modal: false,
      guides: false,
      highlight: false,
      center: false,
      ready() {
        const containerData = cropper.value.getContainerData()
        cropper.value.setCropBoxData({
          left: 0,
          top: 0,
          width: containerData.width,
          height: containerData.height
        })
        emit('cropper-ready', cropper.value)
      },
      zoom(e) {
        zoomValue.value = e.detail.ratio
      }
    })
  }
})

onBeforeUnmount(() => {
  if (cropper.value) {
    cropper.value.destroy()
  }
})

const onZoomChange = () => {
  if (cropper.value) {
    cropper.value.zoomTo(Number(zoomValue.value))
  }
}
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;
}

@media (min-width: 768px) {
  .editor-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 4rem;
  }
}

.editorial-header {
  flex: 1;
}

.cropper-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 500px;
}

.cropper-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--text-muted);
}

.canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.source-image {
  display: block;
  max-width: 100%;
}

.frame-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Crucial for passing events to cropper */
  z-index: 10;
}

:deep(.cropper-view-box) {
  outline: none;
}

:deep(.cropper-face) {
  background-color: transparent !important;
}

/* Brutalist Zoom Controls */
.zoom-controls {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.zoom-label {
  font-family: monospace;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

.zoom-slider {
  flex-grow: 1;
  appearance: none;
  background: transparent;
  outline: none;
}

.zoom-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 1px;
  background: var(--text-muted);
}

.zoom-slider::-webkit-slider-thumb {
  appearance: none;
  width: 15px;
  height: 15px;
  background: var(--text-main);
  margin-top: -7px;
  cursor: pointer;
  border-radius: 0; /* Square thumb */
  transition: background-color 0.3s;
}

.zoom-slider::-webkit-slider-thumb:hover {
  background: var(--accent);
}
</style>
