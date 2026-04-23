<template>
  <div class="histoire-detail-page">
    <div class="top-nav">
      <NuxtLink to="/histoires" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
      </NuxtLink>
    </div>

    <div v-if="chapitre" class="header">
      <div class="chapitre-nav">
        <button class="nav-btn" @click="prevChapitre" :disabled="!hasPrev">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 class="serif-italic">Chapitre N°{{ chapitre.ordre }}</h1>
        <button class="nav-btn" @click="nextChapitre" :disabled="!hasNext">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      <p class="chapitre-title">{{ chapitre.titre }}</p>
      <p class="subtitle">{{ chapitre.histoires.length }} histoires à débloquer avant une récompense.</p>

      <div class="cadenas-list">
        <svg v-for="(h, i) in chapitre.histoires" :key="i"
             :class="{ 'unlocked': h.unlocked }"
             xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
    </div>

    <div v-if="chapitre && chapitre.histoires.length > 0" class="story-container">
      <transition :name="storyTransitionName" mode="out-in">
        <div :key="currentHistoireIndex" class="story-card">
          <div class="story-image">
            <img v-if="currentHistoire.unlocked" :src="currentHistoire.imageCarteUrl || 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600&q=80'" :alt="currentHistoire.titre" />
            <div v-else class="locked-image">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <p>Faites un check-in dans<br><strong>un restaurant Michelin</strong><br>pour débloquer cette histoire</p>
            </div>
          </div>
          <div class="story-content">
            <h2 class="serif-italic" v-if="currentHistoire.unlocked">{{ currentHistoire.titre }}</h2>
            <h2 class="serif-italic" v-else>🔒 Histoire verrouillée</h2>

            <p v-if="currentHistoire.unlocked && currentHistoire.contenu">{{ currentHistoire.contenu }}</p>
            <p v-else-if="!currentHistoire.unlocked" class="locked-text">
              Faites un check-in dans un restaurant Michelin pour débloquer et découvrir cette histoire du Guide.
            </p>

            <div class="story-nav">
              <button class="btn-nav" @click="prevHistoire" :disabled="currentHistoireIndex === 0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <span class="story-counter">{{ currentHistoireIndex + 1 }} / {{ chapitre.histoires.length }}</span>
              <button class="btn-nav" @click="nextHistoire" :disabled="currentHistoireIndex === chapitre.histoires.length - 1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Reward section -->
    <div v-if="chapitre && chapitre.completed && chapitre.recompense" class="reward-section">
      <div class="reward-card">
        <h3>🎁 Récompense débloquée !</h3>
        <p class="reward-title">{{ chapitre.recompense.titre }}</p>
        <p class="reward-desc">{{ chapitre.recompense.description }}</p>
      </div>
    </div>

    <div v-if="!chapitre" class="loading-state">
      <p>Chargement du chapitre...</p>
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

const currentHistoire = computed(() => {
  if (!chapitre.value || !chapitre.value.histoires.length) return null
  return chapitre.value.histoires[currentHistoireIndex.value]
})

const hasPrev = computed(() => {
  if (!allChapitres.value.length) return false
  const idx = allChapitres.value.findIndex(c => c.id === parseInt(route.params.id))
  return idx > 0
})

const hasNext = computed(() => {
  if (!allChapitres.value.length) return false
  const idx = allChapitres.value.findIndex(c => c.id === parseInt(route.params.id))
  return idx < allChapitres.value.length - 1
})

const prevChapitre = () => {
  const idx = allChapitres.value.findIndex(c => c.id === parseInt(route.params.id))
  if (idx > 0) router.push(`/histoires/${allChapitres.value[idx - 1].id}`)
}

const nextChapitre = () => {
  const idx = allChapitres.value.findIndex(c => c.id === parseInt(route.params.id))
  if (idx < allChapitres.value.length - 1) router.push(`/histoires/${allChapitres.value[idx + 1].id}`)
}

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
    console.error('Error loading chapitre:', error)
  }
})

// Watch for route changes (when navigating between chapters)
watch(() => route.params.id, (newId) => {
  if (newId && allChapitres.value.length) {
    chapitre.value = allChapitres.value.find(c => c.id === parseInt(newId))
    currentHistoireIndex.value = 0
    storyTransitionName.value = 'slide-forward'
  }
})
</script>

<style scoped>
.histoire-detail-page {
  background-color: #BA0B2F;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
}

.top-nav { padding: 16px; padding-top: env(safe-area-inset-top, 24px); }
.back-btn {
  color: var(--color-white); display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1);
  text-decoration: none;
}

.header { text-align: center; color: var(--color-white); padding: 0 20px 20px; }
.chapitre-nav { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 8px; }
.nav-btn { color: var(--color-michelin-red); background: none; border: none; padding: 4px; }
.nav-btn:disabled { opacity: 0.3; }
.header h1 { font-size: 1.8rem; margin: 0; }
.chapitre-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 4px; color: var(--color-gold); }
.subtitle { font-size: 0.9rem; color: rgba(255,255,255,0.8); margin-bottom: 16px; }

.cadenas-list { display: flex; justify-content: center; gap: 12px; }
.cadenas-list svg { color: rgba(255,255,255,0.2); }
.cadenas-list svg.unlocked { color: var(--color-gold); }

.story-container {
  flex: 1; padding: 0 20px; display: flex; align-items: center;
  position: relative; overflow: hidden;
}

.story-card {
  background: var(--color-creme); border-radius: 24px;
  width: 100%; overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  display: flex; flex-direction: column;
}

.story-image { height: 200px; width: 100%; }
.story-image img { width: 100%; height: 100%; object-fit: cover; }

.locked-image {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #2a2a2a, #3a3a3a);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  color: rgba(255,255,255,0.5); text-align: center; padding: 20px;
}
.locked-image svg { margin-bottom: 12px; }
.locked-image p { font-size: 0.85rem; line-height: 1.4; }

.story-content { padding: 24px; color: var(--color-dark); position: relative; }
.story-content h2 { color: var(--color-michelin-red); font-size: 1.3rem; margin-bottom: 12px; line-height: 1.3; }
.story-content p { font-size: 0.95rem; color: var(--color-dark-gray); line-height: 1.6; margin-bottom: 20px; }
.locked-text { font-style: italic; }

.story-nav {
  display: flex; align-items: center; justify-content: center; gap: 20px;
}
.btn-nav {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--color-michelin-red); color: white;
  display: flex; align-items: center; justify-content: center;
  border: none;
}
.btn-nav:disabled { opacity: 0.3; }
.story-counter { font-size: 0.9rem; font-weight: 600; color: var(--color-dark-gray); }

.reward-section { padding: 20px; }
.reward-card {
  background: linear-gradient(135deg, #ffd54f, #ffb300);
  border-radius: 16px; padding: 24px;
  text-align: center; color: var(--color-dark);
}
.reward-card h3 { font-size: 1.3rem; margin-bottom: 8px; }
.reward-title { font-weight: 700; font-size: 1.1rem; margin-bottom: 4px; }
.reward-desc { font-size: 0.9rem; opacity: 0.8; }

.loading-state { text-align: center; padding: 40px; color: rgba(255,255,255,0.6); }

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
</style>
