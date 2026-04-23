<template>
  <div class="dossier-detail-page">
    <!-- Header -->
    <div class="top-header">
      <NuxtLink to="/histoires" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
      </NuxtLink>
      <h1 class="serif-italic">Dossier N°{{ chapitre?.ordre }}</h1>
    </div>

    <div v-if="chapitre">
      <!-- Reward Section -->
      <div class="reward-preview">
        <p class="reward-label">Votre récompense est :</p>
        <div class="reward-icon">
          <img src="/images/recompense-gateau.png" alt="Récompense" />
        </div>
      </div>

      <!-- Story Card -->
      <div v-if="chapitre.histoires.length > 0" class="story-section">
        <transition :name="storyTransitionName" mode="out-in">
          <div :key="currentHistoireIndex" class="story-card">
            <!-- Story Image -->
            <div class="story-image">
              <img v-if="currentHistoire.unlocked" :src="getStoryImage(currentHistoireIndex)" :alt="currentHistoire.titre" />
              <div v-else class="locked-image">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <p>Faites un check-in dans<br><strong>un restaurant Michelin</strong><br>pour débloquer cette histoire</p>
              </div>
            </div>

            <!-- Story Content -->
            <div class="story-content">
              <p class="story-year serif-italic" v-if="currentHistoire.unlocked">{{ getStoryYear(currentHistoireIndex) }}</p>

              <h2 class="story-title" v-if="currentHistoire.unlocked">{{ currentHistoire.titre }}</h2>
              <h2 class="story-title" v-else>🔒 Histoire verrouillée</h2>

              <div v-if="currentHistoire.unlocked && currentHistoire.contenu" class="story-text" v-html="formatStoryContent(currentHistoire.contenu)"></div>
              <p v-else-if="!currentHistoire.unlocked" class="locked-text">
                Faites un check-in dans un restaurant Michelin pour débloquer et découvrir cette histoire du Guide.
              </p>
            </div>
          </div>
        </transition>

        <!-- Navigation Arrows (outside the card) -->
        <div class="story-nav-arrows">
          <button
            v-if="currentHistoireIndex > 0"
            class="prev-story-btn"
            @click="prevHistoire"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <span class="story-counter">{{ currentHistoireIndex + 1 }} / {{ chapitre.histoires.length }}</span>
          <button
            v-if="currentHistoireIndex < chapitre.histoires.length - 1"
            class="next-story-btn"
            @click="nextHistoire"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="loading-state">
      <p>Chargement du dossier...</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const chapitre = ref(null)
const currentHistoireIndex = ref(0)
const allChapitres = ref([])
const storyTransitionName = ref('slide-forward')

const storyImages = [
  '/images/histoire-fourchette.png',
  '/images/pommedeterre.jpg',
  '/images/histoire-restaurant.jpg'
]

const storyYears = ['1533', '1785', '1765']

const getStoryImage = (index) => storyImages[index % storyImages.length]
const getStoryYear = (index) => storyYears[index % storyYears.length]

const formatStoryContent = (content) => {
  if (!content) return ''
  // Bold words wrapped in ** **
  return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

const currentHistoire = computed(() => {
  if (!chapitre.value || !chapitre.value.histoires.length) return null
  return chapitre.value.histoires[currentHistoireIndex.value]
})

const nextHistoire = () => {
  if (currentHistoireIndex.value < chapitre.value.histoires.length - 1) {
    storyTransitionName.value = 'slide-forward'
    currentHistoireIndex.value++
  }
}

const prevHistoire = () => {
  if (currentHistoireIndex.value > 0) {
    storyTransitionName.value = 'slide-backward'
    currentHistoireIndex.value--
  }
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const data = await $fetch('/api/chapitres', {
      headers: { Authorization: `Bearer ${token}` }
    })
    allChapitres.value = data

    const id = parseInt(route.params.id)
    chapitre.value = data.find(c => c.id === id)
    currentHistoireIndex.value = 0
  } catch (error) {
    console.error('Error loading dossier:', error)
  }
})

watch(() => route.params.id, (newId) => {
  if (newId && allChapitres.value.length) {
    chapitre.value = allChapitres.value.find(c => c.id === parseInt(newId))
    currentHistoireIndex.value = 0
    storyTransitionName.value = 'slide-forward'
  }
})
</script>

<style scoped>
.dossier-detail-page {
  background-color: #BA0B2F;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
}

/* Header */
.top-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  padding-top: calc(env(safe-area-inset-top, 24px) + 16px);
}

.back-btn {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.4);
  text-decoration: none;
}

.top-header h1 {
  font-size: 1.6rem;
  color: white;
  margin: 0;
}

/* Reward Preview */
.reward-preview {
  text-align: center;
  padding: 0 20px 20px;
}

.reward-label {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 12px;
}

.reward-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.reward-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Story Section */
.story-section {
  flex: 1;
  padding: 0 20px;
  position: relative;
  overflow: hidden;
}

.story-card {
  background: white;
  border-radius: 24px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  position: relative;
}

.story-image {
  height: 220px;
  width: 100%;
}

.story-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.locked-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2a2a2a, #3a3a3a);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.5);
  text-align: center;
  padding: 20px;
}

.locked-image svg {
  margin-bottom: 12px;
}

.locked-image p {
  font-size: 0.85rem;
  line-height: 1.4;
}

/* Story Content */
.story-content {
  padding: 24px;
  color: var(--color-dark);
}

.story-year {
  font-size: 2rem;
  color: var(--color-dark);
  margin-bottom: 8px;
}

.story-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-dark);
  margin-bottom: 12px;
  line-height: 1.3;
}

.story-text {
  font-size: 0.9rem;
  color: var(--color-dark-gray);
  line-height: 1.7;
}

.story-text :deep(strong) {
  color: var(--color-dark);
  font-weight: 700;
}

.locked-text {
  font-style: italic;
  font-size: 0.95rem;
  color: var(--color-dark-gray);
  line-height: 1.6;
}

/* Navigation Arrows Row */
.story-nav-arrows {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  padding: 0 20px;
}

.next-story-btn,
.prev-story-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(255,255,255,0.4);
  cursor: pointer;
  transition: all 0.2s;
}

.next-story-btn:hover,
.prev-story-btn:hover {
  background: rgba(255,255,255,0.25);
}

.story-counter {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: rgba(255,255,255,0.6);
}

/* Animations */
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-backward-enter-active,
.slide-backward-leave-active {
  transition: all 0.4s ease;
}

.slide-forward-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-forward-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-backward-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-backward-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.serif-italic {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 500;
}
</style>
