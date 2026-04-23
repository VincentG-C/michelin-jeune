<template>
  <div class="histoires-page">
    <div class="header">
      <h1 class="serif-italic">L'Histoire du<br>Guide Michelin</h1>
      <p>Collectionnez des tampons pour connaître l'histoire et obtenir des récompenses exclusives.</p>
    </div>

    <div class="chapitres-list">
      <NuxtLink 
        v-for="chapitre in chapitres" 
        :key="chapitre.id" 
        :to="`/histoires/${chapitre.id}`" 
        class="chapitre-card"
      >
        <div class="card-content">
          <h2 class="serif-italic">Chapitre {{ chapitre.number }}</h2>
          <p>{{ chapitre.histoiresCount }} histoires à débloquer avant une récompense.</p>
          <div class="cadenas-list">
            <svg v-for="i in chapitre.histoiresCount" :key="i" 
                 :class="{ 'unlocked': i <= chapitre.unlockedCount }"
                 xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>
        <div class="card-image">
          <img :src="chapitre.image" :alt="'Chapitre ' + chapitre.number" />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const chapitres = ref([
  {
    id: 1,
    number: 'N°1',
    histoiresCount: 3,
    unlockedCount: 2,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80'
  },
  {
    id: 2,
    number: 'N°2',
    histoiresCount: 3,
    unlockedCount: 0,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80'
  },
  {
    id: 3,
    number: 'N°3',
    histoiresCount: 3,
    unlockedCount: 0,
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&q=80'
  }
])
</script>

<style scoped>
.histoires-page {
  background-color: var(--color-dark);
  min-height: 100vh;
  padding: 24px 20px 100px;
  color: var(--color-white);
  padding-top: env(safe-area-inset-top, 24px);
}

.header {
  margin-bottom: 32px;
}

.header h1 {
  font-size: 2.2rem;
  line-height: 1.2;
  margin-bottom: 12px;
  color: var(--color-white);
}

.header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.5;
}

.chapitres-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chapitre-card {
  display: flex;
  background-color: var(--color-creme);
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  color: var(--color-dark);
  box-shadow: var(--shadow-md);
  transition: transform 0.2s;
}

.chapitre-card:active {
  transform: scale(0.98);
}

.card-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-content h2 {
  color: var(--color-michelin-red);
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.card-content p {
  font-size: 0.85rem;
  color: var(--color-dark-gray);
  margin-bottom: 16px;
}

.cadenas-list {
  display: flex;
  gap: 8px;
}

.cadenas-list svg {
  color: #ccc;
}

.cadenas-list svg.unlocked {
  color: var(--color-gold);
}

.card-image {
  width: 120px;
  height: auto;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>