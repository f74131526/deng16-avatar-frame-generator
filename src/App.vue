<template>
  <div class="app-wrapper">
    <!-- Background Watermark Text -->
    <div class="bg-watermark">{{ t('bg_watermark') }}</div>

    <!-- Editorial Navigation -->
    <header class="top-nav">
      <div class="nav-left">
        <img src="./assets/logo.png" alt="Logo" class="logo" />
      </div>
      <div class="lang-switcher">
        <button :class="{ active: locale === 'en' }" @click="locale = 'en'">EN</button>
        <span class="divider">/</span>
        <button :class="{ active: locale === 'zh-tw' }" @click="locale = 'zh-tw'">繁</button>
      </div>
    </header>

    <main class="main-content">
      <Transition name="stark-fade" mode="out-in">
        <!-- Uploader Phase -->
        <Uploader 
          v-if="step === 'upload'" 
          @image-selected="onImageSelected" 
        />
        
        <!-- Editor Phase -->
        <div v-else class="editor-phase">
          <Editor 
            :image-url="currentImageUrl" 
            @cropper-ready="onCropperReady"
          />
          <Toolbar 
            :cropper="cropperInstance"
            @remake="resetApp"
          />
        </div>
      </Transition>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Uploader from './components/Uploader.vue'
import Editor from './components/Editor.vue'
import Toolbar from './components/Toolbar.vue'

const { t, locale } = useI18n()

const step = ref('upload') // 'upload' | 'edit'
const currentImageUrl = ref(null)
const cropperInstance = ref(null)

const onImageSelected = (dataUrl) => {
  currentImageUrl.value = dataUrl
  step.value = 'edit'
}

const onCropperReady = (instance) => {
  cropperInstance.value = instance
}

const resetApp = () => {
  step.value = 'upload'
  currentImageUrl.value = null
  cropperInstance.value = null
}
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.bg-watermark {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 25vw;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.02);
  pointer-events: none;
  z-index: 0;
  letter-spacing: -0.05em;
  white-space: nowrap;
}

.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 2rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  mix-blend-mode: difference;
}

@media (max-width: 768px) {
  .top-nav {
    padding: 1.5rem;
  }
}

.logo {
  height: 60px;
  width: auto;
  object-fit: contain;
}

@media (max-width: 768px) {
  .logo {
    height: 45px;
  }
}

.lang-switcher {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.divider {
  color: var(--text-muted);
  font-family: monospace;
  font-size: 0.85rem;
}

.lang-switcher button {
  font-family: monospace;
  font-size: 0.85rem;
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.lang-switcher button.active {
  color: var(--accent);
}

.lang-switcher button:hover {
  color: var(--text-main);
}

.main-content {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem 2rem;
  position: relative;
  z-index: 10;
}

.editor-phase {
  width: 100%;
  max-width: 1200px; /* Wider for asymmetrical layout */
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* Transitions */
.stark-fade-enter-active,
.stark-fade-leave-active {
  transition: opacity 0.5s ease, filter 0.5s ease;
}

.stark-fade-enter-from,
.stark-fade-leave-to {
  opacity: 0;
  filter: blur(10px);
}
</style>
