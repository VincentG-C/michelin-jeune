<template>
  <div class="histoires-page">
    <div class="header">
      <h1 class="serif-italic">L'Histoire du<br>Guide Michelin</h1>
      <p>Collectionnez des tampons pour connaître l'histoire et obtenir des récompenses exclusives.</p>
    </div>

    <div v-if="chapitres && chapitres.length > 0" class="chapitres-list">
      <NuxtLink
        v-for="chapitre in chapitres"
        :key="chapitre.id"
        :to="`/histoires/${chapitre.id}`"
        class="chapitre-card"
      >
        <div class="card-content">
          <h2 class="serif-italic">Chapitre N°{{ chapitre.ordre }}</h2>
          <p class="chapitre-title">{{ chapitre.titre }}</p>
          <p class="chapitre-desc">{{ chapitre.histoires.length }} histoires à débloquer</p>
          <div class="cadenas-list">
            <svg v-for="(h, i) in chapitre.histoires" :key="i"
                 :class="{ 'unlocked': h.unlocked }"
                 xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div v-if="chapitre.completed" class="completed-badge">✅ Complété</div>
          <div v-if="chapitre.recompense && chapitre.recompense.unlocked" class="reward-badge">
            🎁 {{ chapitre.recompense.titre }}
          </div>
        </div>
        <div class="card-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </NuxtLink>
    </div>
    <div v-else class="loading-state">
      <p>Chargement des chapitres...</p>
    </div>
  </div>
</template>

<script setup>
const chapitres = ref([])

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const data = await $fetch('/api/chapitres', {
      headers: { Authorization: `Bearer ${token}` }
    })
    chapitres.value = data
  } catch (error) {
    console.error('Error loading chapitres:', error)
  }
})
</script>

<style scoped>
.histoires-page {
  background-color: #BA0B2F;
  min-height: 100vh;
  padding: 24px 20px 100px;
  color: var(--color-white);
  padding-top: env(safe-area-inset-top, 24px);
}

.header { margin-bottom: 32px; }
.header h1 { font-size: 2.2rem; line-height: 1.2; margin-bottom: 12px; color: var(--color-white); }
.header p { color: rgba(255, 255, 255, 0.8); font-size: 0.95rem; line-height: 1.5; }

.chapitres-list { display: flex; flex-direction: column; gap: 20px; }

.chapitre-card {
  display: flex;
  background-color: var(--color-creme);
  border-radius: 16px; overflow: hidden;
  text-decoration: none; color: var(--color-dark);
  box-shadow: var(--shadow-md);
  transition: transform 0.2s;
}
.chapitre-card:active { transform: scale(0.98); }

.card-content {
  flex: 1; padding: 20px;
  display: flex; flex-direction: column; justify-content: center;
}
.card-content h2 { color: var(--color-michelin-red); font-size: 1.5rem; margin-bottom: 4px; }
.chapitre-title { font-weight: 600; font-size: 1rem; margin-bottom: 4px; }
.chapitre-desc { font-size: 0.85rem; color: var(--color-dark-gray); margin-bottom: 12px; }

.cadenas-list { display: flex; gap: 8px; margin-bottom: 8px; }
.cadenas-list svg { color: #ccc; }
.cadenas-list svg.unlocked { color: var(--color-gold); }

.completed-badge { font-size: 0.8rem; font-weight: 600; color: #2e7d32; }
.reward-badge { font-size: 0.8rem; font-weight: 600; color: #e65100; margin-top: 4px; }

.card-arrow {
  display: flex; align-items: center; padding: 0 16px;
  color: var(--color-dark-gray);
}

.loading-state { text-align: center; padding: 40px; color: rgba(255,255,255,0.6); }
</style>