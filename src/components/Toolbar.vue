<template>
  <div class="toolbar-container">
    
    <div class="editorial-header">
      <span class="chapter-num">{{ t('step_03') }}</span>
      <h2 class="giant-heading" v-html="t('heading_export')"></h2>
    </div>

    <div class="action-list">
      
      <div class="bg-toggle">
        <span class="label">{{ t('canvas_label') }}</span>
        <div class="bg-options">
          <button 
            class="editorial-link small-link" 
            :class="{ 'text-muted': isOffWhiteBg }" 
            @click="isOffWhiteBg = false"
          >
            [ {{ t('background_transparent') }} ]
          </button>
          <button 
            class="editorial-link small-link" 
            :class="{ 'text-muted': !isOffWhiteBg }" 
            @click="isOffWhiteBg = true"
          >
            [ {{ t('background_offwhite') }} ]
          </button>
        </div>
      </div>

      <div class="export-actions">
        <button class="editorial-link" @click="exportImage(1080)">
          → {{ t('resolution_1080') }}
        </button>
        <button class="editorial-link" @click="exportImage(1600)">
          → {{ t('resolution_1600') }}
        </button>
        <button v-if="canShare" class="editorial-link" @click="shareImage">
          → {{ t('share') }}
        </button>
      </div>
      
      <div class="secondary-actions">
        <button class="editorial-link text-muted" @click="$emit('remake')">
          [ {{ t('remake') }} ]
        </button>
      </div>
    </div>

    <!-- Hidden frame image for canvas drawing -->
    <img ref="frameImg" src="../assets/deng.png" class="hidden" @load="frameLoaded = true" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  cropper: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['remake'])
const { t } = useI18n()

const isOffWhiteBg = ref(false)
const frameImg = ref(null)
const frameLoaded = ref(false)

const canShare = computed(() => {
  return navigator.share !== undefined && navigator.canShare !== undefined
})

const generateCanvas = (resolution) => {
  if (!props.cropper || !frameLoaded.value) return null

  const canvas = document.createElement('canvas')
  canvas.width = resolution
  canvas.height = resolution
  const ctx = canvas.getContext('2d')

  // 1. Draw Background
  if (isOffWhiteBg.value) {
    ctx.fillStyle = '#f4f4f0' // Matter (Off-white)
    ctx.fillRect(0, 0, resolution, resolution)
  } else {
    ctx.clearRect(0, 0, resolution, resolution) // Void (Transparent)
  }

  // 2. Draw Cropper Image
  const croppedCanvas = props.cropper.getCroppedCanvas({
    width: resolution,
    height: resolution,
    fillColor: 'transparent'
  })
  
  if (croppedCanvas) {
    ctx.drawImage(croppedCanvas, 0, 0, resolution, resolution)
  }

  // 3. Draw Frame Overlay
  ctx.drawImage(frameImg.value, 0, 0, resolution, resolution)

  return canvas
}

const exportImage = (resolution) => {
  const canvas = generateCanvas(resolution)
  if (!canvas) return

  const mimeType = isOffWhiteBg.value ? 'image/jpeg' : 'image/png'
  const extension = isOffWhiteBg.value ? 'jpg' : 'png'
  
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `avatar_${resolution}px.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, mimeType, 1.0)
}

const shareImage = async () => {
  const canvas = generateCanvas(1080)
  if (!canvas) return

  const mimeType = isOffWhiteBg.value ? 'image/jpeg' : 'image/png'
  const extension = isOffWhiteBg.value ? 'jpg' : 'png'

  canvas.toBlob(async (blob) => {
    const file = new File([blob], `avatar.${extension}`, { type: mimeType })
    
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: t('app_title'),
          files: [file]
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      alert('Sharing is not supported on this device/browser.')
    }
  }, mimeType, 1.0)
}
</script>

<style scoped>
.toolbar-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;
}

@media (min-width: 768px) {
  .toolbar-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 4rem;
  }
}

.editorial-header {
  flex: 1;
}

.action-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
}

.export-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.bg-toggle {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  font-family: monospace;
}

.bg-options {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 768px) {
  .bg-options {
    gap: 0.5rem;
  }
  .label {
    font-size: 0.85rem;
  }
  .small-link {
    font-size: 0.85rem !important;
  }
}

.label {
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

.small-link {
  font-size: 1rem !important;
}
.small-link::before {
  display: none;
}

.text-muted {
  color: var(--text-muted) !important;
}
.text-muted::before {
  color: var(--text-muted) !important;
}

.secondary-actions {
  margin-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 1rem;
  width: 100%;
}

.hidden {
  display: none;
}
</style>
