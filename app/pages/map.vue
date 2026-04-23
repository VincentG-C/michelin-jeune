<template>
  <div class="map-page">
    <!-- Top Search Bar -->
    <div class="top-bar">
      <div class="search-input">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" placeholder="Rechercher un restaurant..." />
      </div>
      <button class="list-toggle-btn" @click="showList = !showList">
        <svg v-if="!showList" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
      </button>
    </div>

    <!-- Map View -->
    <div v-show="!showList" class="map-container">
      <div class="map-placeholder" style="background-image: url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')">
        <div class="map-overlay"></div>
        
        <!-- Pins -->
        <div class="pin pin-red" style="top: 30%; left: 40%;" @click="selectRestaurant(restaurants[0])">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
        </div>
        <div class="pin pin-purple" style="top: 50%; left: 60%;" @click="selectRestaurant(restaurants[1])">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
        </div>
        <div class="pin pin-blue" style="top: 70%; left: 30%;" @click="selectRestaurant(restaurants[2])">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-show="showList" class="list-container">
      <div class="list-header">
        <h2>Restaurants à proximité</h2>
        <p>16 résultats trouvés</p>
      </div>
      <div class="restaurant-list">
        <div class="restaurant-card" v-for="r in restaurants" :key="r.id" @click="selectRestaurant(r)">
          <div class="card-info">
            <h3 class="serif-italic">{{ r.name }}</h3>
            <p class="address">{{ r.city }} • {{ r.cuisine }}</p>
            <div class="tags">
              <span class="tag" v-for="tag in r.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="card-image">
            <img :src="r.image" :alt="r.name" />
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Sheet Popup -->
    <transition name="slide-up">
      <div v-if="selectedRestaurant && !showList" class="bottom-sheet">
        <div class="sheet-handle"></div>
        <div class="sheet-content">
          <div class="sheet-info">
            <h3 class="serif-italic">{{ selectedRestaurant.name }}</h3>
            <p class="address">{{ selectedRestaurant.address }} • {{ selectedRestaurant.cuisine }}</p>
            <div class="tags">
              <span class="tag" v-for="tag in selectedRestaurant.tags" :key="tag">{{ tag }}</span>
            </div>
            <button class="btn-primary" @click="checkIn">Je suis ici (Check-in)</button>
          </div>
          <div class="sheet-image">
            <img :src="selectedRestaurant.image" :alt="selectedRestaurant.name" />
          </div>
        </div>
        <button class="close-sheet" @click="selectedRestaurant = null">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
const showList = ref(false)
const selectedRestaurant = ref(null)
const router = useRouter()

const restaurants = ref([
  {
    id: 1,
    name: 'Bistrot des Fables',
    address: '139 Rue Saint-Dominique, Paris',
    city: 'Paris 7e',
    cuisine: 'Cuisine traditionnelle',
    tags: ['Pépite caché', 'Bib Gourmand'],
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80'
  },
  {
    id: 2,
    name: 'Table de Mee',
    address: '5 Rue d\'Argenteuil, Paris',
    city: 'Paris 1er',
    cuisine: 'Cuisine coréenne',
    tags: ['Épicé', 'Étoilé'],
    image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400&q=80'
  },
  {
    id: 3,
    name: 'La Cloche d\'Or',
    address: '3 Rue Mansart, Paris',
    city: 'Paris 9e',
    cuisine: 'Brasserie',
    tags: ['Ouvert tard', 'Historique'],
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&q=80'
  }
])

const selectRestaurant = (r) => {
  selectedRestaurant.value = r
}

const checkIn = async () => {
  // Simulate check-in
  alert(`Check-in réussi chez ${selectedRestaurant.value.name}!`)
  router.push('/profil')
}
</script>

<style scoped>
.map-page {
  height: 100vh;
  position: relative;
  background: var(--color-white);
}

.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 16px;
  display: flex;
  gap: 12px;
  z-index: 50;
  background: linear-gradient(to bottom, rgba(255,255,255,0.95) 40%, rgba(255,255,255,0));
  padding-top: env(safe-area-inset-top, 24px);
}

.search-input {
  flex: 1;
  background: var(--color-white);
  border-radius: 30px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow-md);
}

.search-input input {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 1rem;
  outline: none;
}

.list-toggle-btn {
  background: var(--color-white);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  color: var(--color-michelin-red);
}

.map-container {
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.2);
}

.pin {
  position: absolute;
  transform: translate(-50%, -100%);
  cursor: pointer;
  transition: transform 0.2s;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
}

.pin:hover {
  transform: translate(-50%, -110%) scale(1.1);
}

.pin-red { color: var(--color-michelin-red); }
.pin-purple { color: #8A2BE2; }
.pin-blue { color: var(--color-navy); }

/* List View */
.list-container {
  padding: 90px 16px 100px;
  min-height: 100vh;
  background: var(--color-white);
}

.list-header {
  margin-bottom: 20px;
}

.list-header h2 {
  font-size: 1.5rem;
  color: var(--color-dark);
}

.list-header p {
  color: var(--color-dark-gray);
  font-size: 0.9rem;
}

.restaurant-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.restaurant-card {
  display: flex;
  background: var(--color-white);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray);
  overflow: hidden;
}

.card-info {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-info h3 {
  font-size: 1.2rem;
  color: var(--color-michelin-red);
  margin-bottom: 4px;
}

.address {
  font-size: 0.85rem;
  color: var(--color-dark-gray);
  margin-bottom: 12px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  background: var(--color-creme);
  color: var(--color-dark);
  border-radius: 12px;
  font-weight: 500;
}

.card-image {
  width: 100px;
  height: 100%;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Bottom Sheet */
.bottom-sheet {
  position: fixed;
  bottom: 80px; /* above nav */
  left: 0;
  width: 100%;
  background: var(--color-white);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
  z-index: 100;
  padding: 16px 24px 32px;
}

.sheet-handle {
  width: 40px;
  height: 4px;
  background: var(--color-gray);
  border-radius: 2px;
  margin: 0 auto 16px;
}

.sheet-content {
  display: flex;
  gap: 16px;
}

.sheet-info {
  flex: 1;
}

.sheet-info h3 {
  font-size: 1.5rem;
  color: var(--color-michelin-red);
  margin-bottom: 4px;
}

.sheet-info .address {
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.sheet-image {
  width: 90px;
  height: 90px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.sheet-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-primary {
  margin-top: 16px;
  width: 100%;
  background: var(--color-michelin-red);
  color: var(--color-white);
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
}

.close-sheet {
  position: absolute;
  top: 16px;
  right: 16px;
  color: var(--color-dark-gray);
  background: var(--color-gray);
  border-radius: 50%;
  padding: 4px;
  display: flex;
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>