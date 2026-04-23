<template>
  <div class="dossiers-page">
    <div class="header">
      <h1 class="serif-italic">Les dossiers frais</h1>
      <svg class="squiggly-line" width="100%" height="12" viewBox="0 0 300 12" preserveAspectRatio="none">
        <path d="M0 6C30 2 60 10 90 6C120 2 150 10 180 6C210 2 240 10 270 6C285 4 295 8 300 6" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
      </svg>
      <p class="header-desc">Collectionner des badges pour connaitre l'histoire et obtenir des récompenses...</p>
    </div>

    <div v-if="chapitres && chapitres.length > 0" class="dossiers-list">
      <NuxtLink
        v-for="(chapitre, index) in chapitres"
        :key="chapitre.id"
        :to="`/histoires/${chapitre.id}`"
        class="dossier-card"
        :class="`dossier-${index + 1}`"
      >
        <div class="dossier-text">
          <h2 class="serif-italic">Dossier N°{{ chapitre.ordre }}</h2>
          <p class="dossier-desc">{{ chapitre.histoires.length }} histoires à débloquer<br>avant une récompense.</p>
        </div>
        <div class="dossier-image">
          <img :src="dossierImages[index] || dossierImages[0]" :alt="`Dossier ${chapitre.ordre}`" />
        </div>
      </NuxtLink>
    </div>
    <div v-else class="loading-state">
      <p>Chargement des dossiers...</p>
    </div>
  </div>
</template>

<script setup>
const chapitres = ref([])

const dossierImages = [
  '/images/dossier1.png',
  '/images/dossier2.png',
  '/images/dossier3.png'
]

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const data = await $fetch('/api/chapitres', {
      headers: { Authorization: `Bearer ${token}` }
    })
    chapitres.value = data
  } catch (error) {
    console.error('Error loading dossiers:', error)
  }
})
</script>

<style scoped>
.dossiers-page {
  background-color: #BA0B2F;
  min-height: 100vh;
  padding: 24px 20px 100px;
  color: white;
  padding-top: calc(env(safe-area-inset-top, 24px) + 20px);
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h1 {
  font-size: 2.2rem;
  line-height: 1.2;
  margin-bottom: 4px;
}

.squiggly-line {
  display: block;
  width: 100%;
  margin: 4px auto 12px;
}

.header-desc {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  line-height: 1.5;
  max-width: 320px;
  margin: 0 auto;
}

.dossiers-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dossier-card {
  display: flex;
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  color: var(--color-dark);
  transition: transform 0.2s;
  min-height: 160px;
}

.dossier-card:active {
  transform: scale(0.98);
}

/* Card color variants matching Figma */
.dossier-1 {
  background: linear-gradient(135deg, #F4E8DC 0%, #EDD9C7 100%);
}

.dossier-2 {
  background: linear-gradient(135deg, #E8B4B8 0%, #D4919A 100%);
}

.dossier-3 {
  background: linear-gradient(135deg, #D9A0A7 0%, #C47E89 100%);
}

.dossier-text {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.dossier-text h2 {
  font-size: 1.6rem;
  color: var(--color-dark);
  margin-bottom: 8px;
  line-height: 1.2;
}

.dossier-desc {
  font-size: 0.9rem;
  color: var(--color-dark-gray);
  line-height: 1.5;
}

.dossier-image {
  width: 140px;
  flex-shrink: 0;
  overflow: hidden;
}

.dossier-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.6);
}

.serif-italic {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 500;
}
</style>