<template>
  <div class="map-page">
    <!-- Top Search Bar -->
    <div class="top-bar">
      <div class="search-input">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" placeholder="Rechercher un restaurant..." v-model="searchQuery" />
      </div>
      <button class="filter-btn" @click="showFilters = !showFilters">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
      </button>
    </div>

    <!-- Filters Panel -->
    <transition name="slide-down">
      <div v-if="showFilters" class="filters-panel">
        <div class="filter-group">
          <h3>Type Michelin</h3>
          <div class="filter-chips">
            <button :class="['chip', { active: activeFilter.michelin === 'bib' }]" @click="toggleFilter('michelin', 'bib')">Bib Gourmand</button>
            <button :class="['chip', { active: activeFilter.michelin === 'etoile_1' }]" @click="toggleFilter('michelin', 'etoile_1')">1 Étoile ⭐</button>
            <button :class="['chip', { active: activeFilter.michelin === 'etoile_2' }]" @click="toggleFilter('michelin', 'etoile_2')">2 Étoiles ⭐⭐</button>
            <button :class="['chip', { active: activeFilter.michelin === 'etoile_3' }]" @click="toggleFilter('michelin', 'etoile_3')">3 Étoiles ⭐⭐⭐</button>
          </div>
        </div>
        <div class="filter-group">
          <h3>Ambiance</h3>
          <div class="filter-chips">
            <button :class="['chip', { active: activeFilter.vibe === 'eco' }]" @click="toggleFilter('vibe', 'eco')">🌿 Éco</button>
            <button :class="['chip', { active: activeFilter.vibe === 'hidden_gem' }]" @click="toggleFilter('vibe', 'hidden_gem')">💎 Pépite</button>
            <button :class="['chip', { active: activeFilter.vibe === 'visual' }]" @click="toggleFilter('vibe', 'visual')">📸 Visuel</button>
          </div>
        </div>
        <button class="reset-filters" @click="resetFilters">Réinitialiser les filtres</button>
      </div>
    </transition>

    <!-- Map View -->
    <div v-show="!showList" class="map-container" ref="mapContainer"></div>

    <!-- GPS Button -->
    <button v-show="!showList" class="gps-btn" @click="goToMyLocation">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m2 12 2 0"/><path d="m20 12 2 0"/></svg>
    </button>

    <!-- List Toggle Button -->
    <button v-show="!showList" class="list-toggle-floating" @click="showList = true">
      <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.59998 0.5H15.875Z" fill="#BA0B2F"/>
        <path d="M4.59998 0.5H15.875" stroke="#BA0B2F" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.59998 6.5H15.875Z" fill="#BA0B2F"/>
        <path d="M4.59998 6.5H15.875" stroke="#BA0B2F" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.59998 12.5H15.875Z" fill="#BA0B2F"/>
        <path d="M4.59998 12.5H15.875" stroke="#BA0B2F" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.5 0.5V0.51V0.5Z" fill="#BA0B2F"/>
        <path d="M0.5 0.5V0.51" stroke="#BA0B2F" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.5 6.5V6.51V6.5Z" fill="#BA0B2F"/>
        <path d="M0.5 6.5V6.51" stroke="#BA0B2F" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.5 12.5V12.51V12.5Z" fill="#BA0B2F"/>
        <path d="M0.5 12.5V12.51" stroke="#BA0B2F" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- List View -->
    <div v-show="showList" class="list-container">
      <div class="list-header">
        <div>
          <h2>Restaurants à proximité</h2>
          <p>{{ filteredRestaurants.length }} résultats trouvés</p>
        </div>
        <button class="back-to-map" @click="showList = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>
          Carte
        </button>
      </div>
      <div class="restaurant-list">
        <div class="restaurant-card" v-for="r in filteredRestaurants" :key="r.id" @click="selectRestaurant(r); showList = false;">
          <div class="card-info">
            <h3 class="serif-italic">{{ r.name }}</h3>
            <p class="address">{{ r.address }}</p>
            <p class="cuisine-text">{{ r.cuisine || 'Cuisine française' }}</p>
            <div class="tags">
              <span class="tag" v-if="r.michelinType === 'bib'">Bib Gourmand</span>
              <span class="tag" v-else-if="r.michelinType">{{ r.stars }} ⭐</span>
              <span class="tag eco" v-if="r.isEco">🌿 Éco</span>
              <span class="tag gem" v-if="r.isHiddenGem">💎 Pépite</span>
              <span class="tag visual" v-if="r.isVisual">📸 Visuel</span>
            </div>
          </div>
          <div class="card-image">
            <img :src="r.photoUrl || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80'" :alt="r.name" />
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
            <p class="address">{{ selectedRestaurant.address }}</p>
            <p class="cuisine-text">{{ selectedRestaurant.cuisine || 'Cuisine française' }}</p>
            <div class="tags">
              <span class="tag" v-if="selectedRestaurant.michelinType === 'bib'">Bib Gourmand</span>
              <span class="tag" v-else-if="selectedRestaurant.michelinType">{{ selectedRestaurant.stars }} ⭐</span>
              <span class="tag eco" v-if="selectedRestaurant.isEco">🌿 Éco</span>
              <span class="tag gem" v-if="selectedRestaurant.isHiddenGem">💎 Pépite</span>
            </div>
            <button class="btn-primary" @click="checkIn" :disabled="checkingIn">
              {{ checkingIn ? 'Check-in...' : 'Je suis ici (Check-in)' }}
            </button>
          </div>
          <div class="sheet-image">
            <img :src="selectedRestaurant.photoUrl || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80'" :alt="selectedRestaurant.name" />
          </div>
        </div>
        <button class="close-sheet" @click="selectedRestaurant = null">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </transition>

    <!-- Error Modal (Too Far) -->
    <transition name="fade">
      <div v-if="checkinError" class="modal-overlay" @click="checkinError = null">
        <div class="modal-card" @click.stop>
          <div class="modal-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#BA0B2F" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h3>Oups !</h3>
          <p class="modal-message">{{ checkinError }}</p>
          <button class="btn-primary" @click="checkinError = null">J'ai compris</button>
        </div>
      </div>
    </transition>

    <!-- Check-in Success Toast -->
    <transition name="fade">
      <div v-if="checkinSuccess" class="toast-success">
        <span>✅ {{ checkinSuccess }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
const showList = ref(false)
const showFilters = ref(false)
const selectedRestaurant = ref(null)
const searchQuery = ref('')
const checkingIn = ref(false)
const checkinSuccess = ref('')
const checkinError = ref(null)
const mapContainer = ref(null)
const router = useRouter()
const restaurants = ref([])
let map = null
let markers = []
let mapboxgl = null

const activeFilter = ref({
  michelin: null,
  vibe: null
})

const config = useRuntimeConfig()

// Filtered restaurants
const filteredRestaurants = computed(() => {
  if (!restaurants.value) return []
  let result = restaurants.value

  // Search filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(r => r.name.toLowerCase().includes(q) || (r.cuisine && r.cuisine.toLowerCase().includes(q)) || r.address.toLowerCase().includes(q))
  }

  // Michelin filter
  if (activeFilter.value.michelin) {
    result = result.filter(r => r.michelinType === activeFilter.value.michelin)
  }

  // Vibe filter
  if (activeFilter.value.vibe) {
    if (activeFilter.value.vibe === 'eco') result = result.filter(r => r.isEco)
    if (activeFilter.value.vibe === 'hidden_gem') result = result.filter(r => r.isHiddenGem)
    if (activeFilter.value.vibe === 'visual') result = result.filter(r => r.isVisual)
  }

  return result
})

const toggleFilter = (type, value) => {
  if (activeFilter.value[type] === value) {
    activeFilter.value[type] = null
  } else {
    activeFilter.value[type] = value
  }
  updateMarkers()
}

const resetFilters = () => {
  activeFilter.value = { michelin: null, vibe: null }
  searchQuery.value = ''
  showFilters.value = false
  updateMarkers()
}

const updateMarkers = () => {
  // Remove old markers
  markers.forEach(m => m.remove())
  markers = []

  if (!map || !mapboxgl) return

  filteredRestaurants.value.forEach(r => {
    const el = document.createElement('div')
    el.className = 'custom-marker'
    el.innerHTML = `
      <div style="position: relative; width: 46px; height: 64px; display: flex; flex-direction: column; align-items: center;">
        <div style="position: absolute; top: 0; width: 46px; height: 46px; border-radius: 50%; border: 2px solid #BA0B2F; background: #F3EFE9; display: flex; align-items: center; justify-content: center; z-index: 2;">
          <svg width="26" height="24" viewBox="0 0 31 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.3976 17.5C13.0489 17.5 14.8704 15.5147 14.9967 12.018C15.0808 9.08292 13.5558 6.66666 11.3976 6.66666C9.06706 6.66666 7.5 9.29942 7.5 12.3631C7.5 15.3411 9.4919 17.5 11.3976 17.5ZM11.3976 7.74509C13.0068 7.74509 14.2773 9.81615 14.149 12.3631C14.0649 14.6078 13.0068 15.6863 13.0068 15.6863C13.8104 12.406 12.5819 11.4563 11.3976 11.4563C10.0851 11.4563 8.94082 12.406 9.49189 15.5147C9.49189 15.5147 8.38975 14.3484 8.38975 12.3631C8.38975 9.77327 9.66023 7.74509 11.3976 7.74509Z" fill="#BA0B2F"/>
            <path d="M24.1666 12.3631C24.1666 9.29942 22.5996 6.66666 20.269 6.66666C18.1108 6.66666 16.5858 9.08292 16.6699 12.018C16.7962 15.5147 18.6178 17.5 20.269 17.5C22.1747 17.5 24.1666 15.3411 24.1666 12.3631ZM23.2769 12.3631C23.2769 14.3484 22.1747 15.5147 22.1747 15.5147C22.7258 12.406 21.5816 11.4563 20.269 11.4563C19.0847 11.4563 17.8563 12.406 18.6598 15.6863C18.6598 15.6863 17.6018 14.6078 17.5176 12.3631C17.3894 9.81615 18.6598 7.74509 20.269 7.74509C22.0064 7.74509 23.2769 9.77327 23.2769 12.3631Z" fill="#BA0B2F"/>
            <path d="M28.3155 14.177L28.2523 14.1147L28.2664 14.0273C28.7639 10.9215 27.7733 4.4883 20.4627 2.37065L20.4 2.35248L20.3649 2.29748C19.4618 0.880315 17.5867 0 15.4714 0L15.385 0.000491208C13.2669 0.0297599 11.4359 0.908307 10.6066 2.29336L10.5715 2.3519L10.5057 2.37075C4.1957 4.18491 1.67734 10.4506 2.28545 14.276L2.29801 14.3553L2.2452 14.4158C-2.1479 19.4473 1.13738 24.5803 1.84022 25.5577C2.63959 26.6839 4.5089 28.3198 5.62413 28.3198H5.6986L5.72075 28.2493C6.19901 26.7275 5.71966 26.3576 4.99417 25.798L4.90438 25.7286C4.8928 25.7196 3.74493 24.8164 2.89711 23.736C2.24846 22.9096 1.6008 21.3692 1.71176 19.9395C1.8512 18.1428 2.66856 15.7651 4.5444 14.4815L4.60472 14.44L4.58415 14.3703C4.40921 13.7788 4.2665 12.2474 4.84029 10.2591C5.32923 8.56547 7.05761 4.56864 12.5336 4.03808L12.796 4.01264L12.584 3.85706C12.3323 3.67232 12.1734 3.49003 12.1121 3.31511C12.063 3.17564 12.0728 3.03588 12.1347 2.92037L12.1562 2.88767C12.8574 2.14171 14.498 1.7238 16.0559 1.8944C17.2596 2.02591 18.1777 2.48498 18.5758 3.15511C18.7235 3.39545 18.666 3.58884 18.6186 3.68244C18.5777 3.76297 18.5103 3.8387 18.4184 3.90765L18.2193 4.05703L18.467 4.08768C23.3511 4.69141 25.1797 7.59038 25.8535 9.91595C26.369 11.6943 26.2996 13.6855 26.0514 14.4392L26.0298 14.505L26.0839 14.5486C28.2841 16.3216 29.1629 18.4072 28.6962 20.7475C28.3059 22.7047 27.3362 24.1892 26.7928 24.8997C26.5566 25.2087 26.2564 25.5017 25.9917 25.7605C25.6207 26.1229 25.3004 26.436 25.2342 26.7084C25.044 27.4902 25.3274 28.0014 25.5987 28.2925L25.6369 28.3333L25.6919 28.3229C26.4746 28.1758 27.779 26.6358 28.6926 25.4898C29.5019 24.4603 33.2868 19.0768 28.3155 14.177Z" fill="#BA0B2F"/>
            <path d="M22.9013 20.8394C22.5599 21.5543 22.4646 21.7698 21.8419 22.6688C21.643 18.0934 19.8879 18.3356 19.8879 18.3356C19.8879 18.3356 17.8615 18.3333 16.6282 21.8524C15.9686 23.7344 15.8333 24.4097 15.7614 25.2033C15.7614 25.2033 15.4711 25.238 15.3464 25.2433C10.9661 25.4268 9.09857 22.6226 8.69114 22.1506C8.28369 21.6786 7.74891 22.1506 7.74891 22.1506C7.31206 22.6001 7.58313 23.129 7.58313 23.129C8.18863 23.9944 10.2446 26.6667 15.8812 26.6667C21.5178 26.6667 23.5381 22.8562 23.7927 22.3866C24.0474 21.9171 24.4039 21.1279 23.9456 20.6559C23.2826 20.1209 22.9013 20.8394 22.9013 20.8394Z" fill="#BA0B2F"/>
          </svg>
        </div>
        <svg style="position: absolute; bottom: 8px; width: 22px; height: 22px; z-index: 1;" viewBox="0 0 24 24" fill="#BA0B2F" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 24L0 0H24L12 24Z" />
        </svg>
      </div>
    `
    el.addEventListener('click', (e) => {
      e.stopPropagation()
      selectRestaurant(r)
    })

    const marker = new mapboxgl.Marker(el)
      .setLngLat([r.lng, r.lat])
      .addTo(map)
    markers.push(marker)
  })
}

// Watch search query changes
watch(searchQuery, () => {
  updateMarkers()
})

onMounted(async () => {
  // Fetch restaurants from backend
  try {
    const data = await $fetch('/api/restaurants')
    restaurants.value = data || []
  } catch (e) {
    console.error('Failed to fetch restaurants:', e)
  }

  if (!mapContainer.value) return

  // Dynamic import of mapbox (client-only)
  try {
    const mb = await import('mapbox-gl')
    await import('mapbox-gl/dist/mapbox-gl.css')
    mapboxgl = mb.default || mb

    const token = config.public.mapboxToken
    if (!token) {
      console.warn('Mapbox token manquant. Configurez MAPBOX_PUBLIC_TOKEN dans .env')
      return
    }

    mapboxgl.accessToken = token

    map = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.3522, 48.8566],
      zoom: 12
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-left')

    map.on('load', () => {
      updateMarkers()
    })

    map.on('click', () => {
      selectedRestaurant.value = null
    })
  } catch (e) {
    console.error('Failed to init Mapbox:', e)
  }
})

const selectRestaurant = (r) => {
  selectedRestaurant.value = r
  if (map) {
    map.flyTo({
      center: [r.lng, r.lat],
      zoom: 15,
      essential: true
    })
  }
}

const goToMyLocation = () => {
  if (!navigator.geolocation) {
    checkinError.value = 'Géolocalisation non supportée par votre navigateur'
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      if (map) {
        map.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 14,
          essential: true
        })
      }
    },
    () => {
      checkinError.value = 'Impossible de récupérer votre position'
    }
  )
}

const checkIn = async () => {
  if (!selectedRestaurant.value) return
  checkingIn.value = true

  // Get user's current position
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const token = localStorage.getItem('token')
        const res = await $fetch('/api/passport/checkin', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: {
            restaurant_id: selectedRestaurant.value.id,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
        })

        checkinSuccess.value = `Check-in chez ${selectedRestaurant.value.name} ! 🎉`
        if (res.histoireDebloquee) {
          checkinSuccess.value += ` Histoire débloquée : "${res.histoireDebloquee.titre}"`
        }
        selectedRestaurant.value = null

        setTimeout(() => { checkinSuccess.value = '' }, 4000)
      } catch (error) {
        checkinError.value = error.data?.message || error.statusMessage || 'Erreur lors du check-in'
      } finally {
        checkingIn.value = false
      }
    },
    () => {
      alert('Activez la géolocalisation pour le check-in')
      checkingIn.value = false
    }
  )
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
  background: transparent;
  /* Increased margin from top */
  padding-top: calc(env(safe-area-inset-top, 24px) + 40px);
  pointer-events: none; /* Let clicks pass through the top-bar background */
}

.top-bar > * {
  pointer-events: auto; /* Re-enable clicks for buttons/inputs */
}

.search-input {
  display: flex !important;
  align-items: center !important;
  background-color: #FFFFFF !important;
  border-radius: 28px !important;
  padding: 0 16px !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
  flex: 1 !important;
  border: 1.5px solid #BA0B2F !important;
  height: 48px !important; /* Fixed height for consistency */
}

.search-input input {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 1rem;
  outline: none;
  padding: 12px;
}

.filter-btn {
  background: var(--color-white);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1.5px solid #BA0B2F;
  color: #BA0B2F;
}

/* Filters Panel */
.filters-panel {
  position: fixed;
  top: 80px;
  left: 16px;
  right: 16px;
  background: var(--color-white);
  border-radius: 20px;
  padding: 20px;
  z-index: 55;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.filter-group { margin-bottom: 16px; }
.filter-group h3 { font-size: 0.9rem; font-weight: 600; margin-bottom: 10px; color: var(--color-dark); }
.filter-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
  padding: 8px 14px; border-radius: 20px; font-size: 0.8rem;
  background: var(--color-gray); color: var(--color-dark); border: none;
  transition: all 0.2s;
}
.chip.active { background: var(--color-michelin-red); color: white; }
.reset-filters {
  width: 100%; padding: 10px; background: transparent;
  color: var(--color-michelin-red); font-weight: 600; font-size: 0.9rem;
  border: 1px solid var(--color-michelin-red); border-radius: 12px;
}

.map-container {
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.map-container :deep(.mapboxgl-canvas) { outline: none; }
.map-container :deep(.custom-marker) {
  cursor: pointer;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
  transition: transform 0.2s;
}
.map-container :deep(.custom-marker:hover) {
  transform: scale(1.2);
}

/* GPS Button */
.gps-btn {
  position: fixed;
  bottom: 150px;
  right: 16px;
  width: 48px; height: 48px;
  border-radius: 50%;
  background: var(--color-white);
  border: 1.5px solid #BA0B2F;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  display: flex; align-items: center; justify-content: center;
  z-index: 40;
  color: var(--color-michelin-red);
}

/* List Toggle Floating */
.list-toggle-floating {
  position: fixed;
  bottom: 90px;
  right: 16px;
  width: 48px; height: 48px;
  border-radius: 50%;
  background: var(--color-white);
  border: 1.5px solid #BA0B2F;
  color: var(--color-michelin-red);
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  display: flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: 0.95rem; gap: 8px;
  z-index: 40;
}

/* List View */
.list-container {
  padding: 90px 16px 100px;
  min-height: 100vh;
  background: #BA0B2F;
  position: relative;
  z-index: 30;
}

.list-header {
  margin-bottom: 20px;
  display: flex; justify-content: space-between; align-items: center;
}
.list-header h2 { font-size: 1.5rem; color: white; }
.list-header p { color: rgba(255,255,255,0.8); font-size: 0.9rem; }
.back-to-map {
  display: flex; align-items: center; gap: 4px;
  color: var(--color-michelin-red); font-weight: 600; font-size: 0.9rem;
  background: var(--color-creme); padding: 8px 16px; border-radius: 20px;
}

.restaurant-list { display: flex; flex-direction: column; gap: 16px; }

.restaurant-card {
  display: flex; background: var(--color-white); border-radius: 16px;
  box-shadow: var(--shadow-sm); border: 1px solid var(--color-gray);
  overflow: hidden; cursor: pointer;
}

.card-info { flex: 1; padding: 16px; display: flex; flex-direction: column; justify-content: center; }
.card-info h3 { font-size: 1.2rem; color: var(--color-michelin-red); margin-bottom: 4px; }
.address { font-size: 0.85rem; color: var(--color-dark-gray); margin-bottom: 4px; }
.cuisine-text { font-size: 0.8rem; color: var(--color-dark-gray); font-style: italic; margin-bottom: 8px; }

.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  font-size: 0.7rem; padding: 3px 8px; background: var(--color-creme);
  color: var(--color-dark); border-radius: 12px; font-weight: 500;
}
.tag.eco { background: #e8f5e9; color: #2e7d32; }
.tag.gem { background: #ede7f6; color: #5e35b1; }
.tag.visual { background: #fff3e0; color: #e65100; }

.card-image { width: 100px; min-height: 100px; }
.card-image img { width: 100%; height: 100%; object-fit: cover; }

/* Bottom Sheet */
.bottom-sheet {
  position: fixed; 
  bottom: 84px; 
  left: 16px; 
  right: 16px; 
  width: auto;
  background: #F4F1EA;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border: 2px solid #BA0B2F;
  z-index: 50;
  max-height: 80vh; 
  padding: 20px;
  overflow: hidden;
}
.sheet-handle { width: 40px; height: 4px; background: var(--color-gray); border-radius: 2px; margin: 0 auto 16px; }
.sheet-content { display: flex; gap: 16px; }
.sheet-info { flex: 1; }
.sheet-info h3 { font-size: 1.5rem; color: var(--color-michelin-red); margin-bottom: 4px; }
.sheet-info .address { font-size: 0.9rem; margin-bottom: 4px; }
.sheet-info .cuisine-text { margin-bottom: 8px; }
.sheet-image { width: 90px; height: 90px; border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-sm); }
.sheet-image img { width: 100%; height: 100%; object-fit: cover; }

.btn-primary {
  margin-top: 12px; width: 100%;
  background: var(--color-michelin-red); color: var(--color-white);
  padding: 12px; border-radius: 12px; font-weight: 600; font-size: 1rem;
  border: none;
}
.btn-primary:disabled { opacity: 0.5; }

.close-sheet {
  position: absolute; top: 16px; right: 16px;
  color: var(--color-dark-gray); background: var(--color-gray);
  border-radius: 50%; padding: 4px; display: flex;
}

.toast-success {
  position: fixed; top: 90px; left: 16px; right: 16px;
  background: #2e7d32; color: white; padding: 14px 20px;
  border-radius: 14px; z-index: 200; text-align: center;
  font-weight: 500; box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

/* Modal Overlay */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 20px;
  backdrop-filter: blur(4px);
}
.modal-card {
  background: #F4F1EA;
  width: 100%; max-width: 320px;
  border-radius: 24px; padding: 32px 24px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  border: 2.5px solid #BA0B2F;
}
.modal-icon { margin-bottom: 20px; }
.modal-card h3 { font-size: 1.8rem; color: #BA0B2F; margin-bottom: 12px; }
.modal-message { font-size: 1rem; line-height: 1.5; color: var(--color-dark); margin-bottom: 24px; }

/* Animations */
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>