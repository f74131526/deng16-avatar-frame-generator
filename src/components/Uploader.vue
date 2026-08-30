<template>
  <div class="uploader-container">
    <div class="editorial-header">
      <span class="chapter-num">{{ t('step_01') }}</span>
      <h1 class="giant-heading" v-html="t('heading_upload')"></h1>
      <p class="subtitle">{{ t('app_title') }}</p>
    </div>

    <div class="interaction-area">
      <div v-if="cameraStream" class="camera-view">
        <div class="camera-frame">
          <video ref="videoElement" autoplay playsinline class="video-preview"></video>
          <div class="crosshair top-left"></div>
          <div class="crosshair top-right"></div>
          <div class="crosshair bottom-left"></div>
          <div class="crosshair bottom-right"></div>
        </div>
        
        <div class="action-list">
          <button class="editorial-link" @click="capturePhoto">
            [ {{ t('capture') }} ]
          </button>
          <button class="editorial-link text-muted" @click="stopCamera">
            [ {{ t('cancel') }} ]
          </button>
        </div>
      </div>

      <div v-else class="action-list">
        <button class="editorial-link" @click="startCamera">
          → {{ t('take_photo') }}
        </button>
        
        <label class="editorial-link">
          → {{ t('upload_photo') }}
          <input 
            type="file" 
            accept="image/*" 
            @change="onFileChange" 
            class="hidden-input"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['image-selected'])

const cameraStream = ref(null)
const videoElement = ref(null)

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (event) => {
    emit('image-selected', event.target.result)
  }
  reader.readAsDataURL(file)
}

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'user' } 
    })
    cameraStream.value = stream
    await nextTick()
    if (videoElement.value) {
      videoElement.value.srcObject = stream
    }
  } catch (err) {
    console.error('Camera access denied:', err)
    alert(t('camera_denied'))
  }
}

const stopCamera = () => {
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach(track => track.stop())
    cameraStream.value = null
  }
}

const capturePhoto = () => {
  if (!videoElement.value) return
  
  const video = videoElement.value
  const vw = video.videoWidth
  const vh = video.videoHeight
  
  const size = Math.min(vw, vh)
  const sx = (vw - size) / 2
  const sy = (vh - size) / 2
  
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  
  // Mirror the image to match the video preview
  ctx.translate(size, 0)
  ctx.scale(-1, 1)
  
  ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size)
  
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
  stopCamera()
  emit('image-selected', dataUrl)
}

onBeforeUnmount(() => {
  stopCamera()
})
</script>

<style scoped>
.uploader-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
  gap: 2rem;
}

@media (min-width: 768px) {
  .uploader-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 4rem;
  }
}

.editorial-header {
  flex: 1;
}

.subtitle {
  color: var(--text-muted);
  font-family: monospace;
  letter-spacing: 0.2em;
  margin-top: 1rem;
}

.interaction-area {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

@media (min-width: 768px) {
  .interaction-area {
    justify-content: flex-end;
  }
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-start;
}

.hidden-input {
  display: none;
}

.camera-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 400px;
}

.camera-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  border: 1px solid var(--text-muted);
  padding: 10px;
}

.video-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
}

.crosshair {
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: var(--accent);
  border-style: solid;
  border-width: 0;
}

.top-left { top: -1px; left: -1px; border-top-width: 2px; border-left-width: 2px; }
.top-right { top: -1px; right: -1px; border-top-width: 2px; border-right-width: 2px; }
.bottom-left { bottom: -1px; left: -1px; border-bottom-width: 2px; border-left-width: 2px; }
.bottom-right { bottom: -1px; right: -1px; border-bottom-width: 2px; border-right-width: 2px; }

.text-muted {
  color: var(--text-muted) !important;
}
.text-muted::before {
  color: var(--text-muted) !important;
}
</style>
