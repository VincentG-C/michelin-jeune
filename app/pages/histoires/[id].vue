<template>
  <div class="histoire-detail-page">
    <div class="top-nav">
      <NuxtLink to="/histoires" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
      </NuxtLink>
    </div>

    <div class="header">
      <div class="chapitre-nav">
        <button class="nav-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg></button>
        <h1 class="serif-italic">Chapitre N°{{ route.params.id }}</h1>
        <button class="nav-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></button>
      </div>
      
      <p class="subtitle">3 histoires à débloquer avant une récompense.</p>
      
      <div class="cadenas-list">
        <svg v-for="i in 3" :key="i" 
             :class="{ 'unlocked': i <= currentHistoireIndex + 1 }"
             xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
    </div>

    <div class="story-container">
      <transition name="slide">
        <div :key="currentHistoireIndex" class="story-card">
          <div class="story-image">
            <img :src="currentHistoire.image" :alt="currentHistoire.title" />
          </div>
          <div class="story-content">
            <h2 class="serif-italic">{{ currentHistoire.year }} · {{ currentHistoire.title }}</h2>
            <p>{{ currentHistoire.text }}</p>
            
            <button class="btn-continue" @click="nextHistoire">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

const histoires = ref([
  {
    year: '1900',
    title: 'Tout commence ici',
    text: 'À l\'aube du XXe siècle, les frères André et Édouard Michelin publient la première édition du Guide Michelin. Tiré à 35 000 exemplaires, il est offert gratuitement aux chauffeurs pour faciliter leurs déplacements et développer l\'automobile.',
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600&q=80'
  },
  {
    year: '1920',
    title: 'La fin de la gratuité',
    text: 'André Michelin découvre ses guides servant à caler les établis dans un garage. "L\'homme ne respecte que ce qu\'il paie", se dit-il. Le guide est alors vendu 7 francs et intègre une liste de restaurants.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80'
  },
  {
    year: '1926',
    title: 'L\'étoile de bonne table',
    text: 'Le guide commence à attribuer des étoiles pour la "bonne cuisine". Cinq ans plus tard, le système s\'étend à deux puis trois étoiles, devenant la référence gastronomique mondiale.',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&q=80'
  }
])

const currentHistoireIndex = ref(0)
const currentHistoire = computed(() => histoires.value[currentHistoireIndex.value])

const nextHistoire = () => {
  if (currentHistoireIndex.value < histoires.value.length - 1) {
    currentHistoireIndex.value++
  } else {
    alert('Récompense débloquée !')
  }
}
</script>

<style scoped>
.histoire-detail-page {
  background-color: var(--color-dark);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
}

.top-nav {
  padding: 16px;
  padding-top: env(safe-area-inset-top, 24px);
}

.back-btn {
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
}

.header {
  text-align: center;
  color: var(--color-white);
  padding: 0 20px 20px;
}

.chapitre-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
}

.nav-btn {
  color: var(--color-michelin-red);
}

.header h1 {
  font-size: 1.8rem;
  margin: 0;
}

.subtitle {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 16px;
}

.cadenas-list {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.cadenas-list svg {
  color: rgba(255,255,255,0.2);
}

.cadenas-list svg.unlocked {
  color: var(--color-gold);
}

.story-container {
  flex: 1;
  padding: 0 20px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.story-card {
  background: var(--color-creme);
  border-radius: 24px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
}

.story-image {
  height: 200px;
  width: 100%;
}

.story-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-content {
  padding: 24px;
  color: var(--color-dark);
  position: relative;
}

.story-content h2 {
  color: var(--color-michelin-red);
  font-size: 1.4rem;
  margin-bottom: 12px;
  line-height: 1.3;
}

.story-content p {
  font-size: 0.95rem;
  color: var(--color-dark-gray);
  line-height: 1.6;
  margin-bottom: 30px;
}

.btn-continue {
  position: absolute;
  bottom: -24px;
  right: 24px;
  background: var(--color-michelin-red);
  color: var(--color-white);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(196, 18, 48, 0.4);
  transform: translateY(-50%);
  transition: transform 0.2s;
}

.btn-continue:active {
  transform: translateY(-50%) scale(0.95);
}

/* Animations */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
  position: absolute;
  width: calc(100% - 40px);
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>