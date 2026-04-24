<template>
  <div class="reservation-page" v-if="restaurant">
    <!-- Back Button -->
    <div class="top-nav">
      <button class="back-btn" @click="router.back()">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
      </button>
    </div>

    <!-- Photo Gallery -->
    <div class="photo-gallery">
      <div class="gallery-scroll">
        <div class="gallery-item" v-for="(photo, i) in galleryPhotos" :key="i">
          <img :src="photo" :alt="`${restaurant.name} photo ${i + 1}`" />
        </div>
      </div>
    </div>

    <!-- Restaurant Info -->
    <div class="restaurant-info">
      <div class="info-header">
        <div>
          <h1 class="serif-italic">{{ restaurant.name }}</h1>
          <p class="cuisine-label">{{ restaurant.cuisine || 'Cuisine française' }}</p>
        </div>
        <button class="fav-btn" :class="{ active: isFavorite }" @click="isFavorite = !isFavorite">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" :fill="isFavorite ? '#BA0B2F' : 'none'" stroke="#BA0B2F" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </button>
      </div>

      <div class="info-details">
        <div class="detail-row">
          <p class="detail-address">{{ restaurant.address }}</p>
          <span class="detail-icon">
            <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.5 9.83333V1.83333C0.5 1.09695 1.09695 0.5 1.83333 0.5H8.5M4.5 13.8333H10.5C11.2364 13.8333 11.8333 13.2364 11.8333 12.5V4.5C11.8333 3.76362 11.2364 3.16667 10.5 3.16667H4.5C3.76362 3.16667 3.16667 3.76362 3.16667 4.5V12.5C3.16667 13.2364 3.76362 13.8333 4.5 13.8333Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </div>
        <div class="detail-row">
          <p>+33 1 54 73 99 67</p>
          <span class="detail-icon">
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.41965 9.17115C6.19762 10.7616 7.4869 12.045 9.0809 12.8157C9.1975 12.871 9.3265 12.8949 9.4552 12.8852C9.5839 12.8754 9.7079 12.8323 9.8148 12.7602L12.1619 11.1951C12.2657 11.1259 12.3852 11.0836 12.5094 11.0722C12.6337 11.0608 12.7588 11.0806 12.8735 11.1297L17.2644 13.0115C17.4136 13.0749 17.5381 13.185 17.6193 13.3253C17.7004 13.4656 17.7338 13.6285 17.7143 13.7894C17.5755 14.8754 17.0456 15.8736 16.2239 16.597C15.4021 17.3205 14.3448 17.7196 13.25 17.7196C9.8685 17.7196 6.62548 16.3763 4.23439 13.9853C1.8433 11.5942 0.5 8.35125 0.5 4.9697C0.50006 3.87486 0.89918 2.81758 1.62264 1.99583C2.3461 1.17408 3.34428 0.644196 4.43028 0.505416C4.59117 0.485946 4.75403 0.519286 4.89432 0.600416C5.03461 0.681556 5.14473 0.806086 5.2081 0.955246L7.0916 5.35005C7.1403 5.46372 7.1601 5.58768 7.1494 5.71089C7.1386 5.83409 7.0975 5.95272 7.0298 6.0562L5.47011 8.43925C5.39912 8.54655 5.35716 8.67024 5.34831 8.79854C5.33947 8.92684 5.36405 9.05515 5.41965 9.17115Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </div>
        <div class="detail-row">
          <p>Visiter le site internet</p>
          <span class="detail-icon">
            <svg width="19" height="9" viewBox="0 0 19 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 0.5H4.5C2.29086 0.5 0.5 2.29086 0.5 4.5C0.5 6.7091 2.29086 8.5 4.5 8.5H7.5M11.5 0.5H14.5C16.7091 0.5 18.5 2.29086 18.5 4.5C18.5 6.7091 16.7091 8.5 14.5 8.5H11.5M6.5 4.5H12.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </div>
      </div>

      <div class="info-tags">
        <span class="tag" v-if="restaurant.isHiddenGem">Pépite cachée</span>
        <span class="tag" v-if="restaurant.isEco">Options véganes</span>
        <span class="tag" v-if="restaurant.ambiance">{{ restaurant.ambiance }}</span>
        <span class="tag" v-if="restaurant.michelinType === 'bib'">Bib Gourmand</span>
        <span class="tag" v-else-if="restaurant.stars">{{ restaurant.stars }} ⭐</span>
      </div>
    </div>

    <!-- Divider -->
    <div class="divider">
      <svg class="squiggly-line" width="100%" height="12" viewBox="0 0 300 12" preserveAspectRatio="none">
        <path d="M0 6C30 2 60 10 90 6C120 2 150 10 180 6C210 2 240 10 270 6C285 4 295 8 300 6" stroke="#ccc" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      </svg>
    </div>

    <!-- Reservation Section -->
    <div class="reservation-section">
      <h2 class="serif-italic">Réserver une table</h2>

      <!-- Day Picker -->
      <div class="picker-group">
        <h3>Choisir un jour</h3>
        <div class="day-grid">
          <button
            v-for="day in availableDays"
            :key="day.date"
            :class="['day-btn', { active: selectedDay === day.date }]"
            @click="selectedDay = day.date"
          >
            <span class="day-label">{{ day.label }}</span>
            <span class="day-number">{{ day.number }}</span>
          </button>
        </div>
      </div>

      <!-- Time Picker -->
      <div class="picker-group">
        <h3>Choisir une horaire</h3>
        <div class="time-grid">
          <button
            v-for="time in availableTimes"
            :key="time"
            :class="['time-btn', { active: selectedTime === time }]"
            @click="selectedTime = time"
          >
            {{ time }}
          </button>
        </div>
      </div>

      <!-- People Picker -->
      <div class="picker-group">
        <h3>Nombre de personnes</h3>
        <div class="people-grid">
          <button
            v-for="n in 8"
            :key="n"
            :class="['people-btn', { active: selectedPeople === n }]"
            @click="selectedPeople = n"
          >
            {{ n }}
          </button>
        </div>
      </div>

      <!-- Reserve Button -->
      <button class="reserve-btn" @click="makeReservation">
        Réserver
      </button>
    </div>

    <!-- Success Modal -->
    <transition name="fade">
      <div v-if="showSuccess" class="modal-overlay" @click="showSuccess = false">
        <div class="modal-card" @click.stop>
          <div class="modal-icon">✅</div>
          <h3 class="serif-italic">Réservation confirmée !</h3>
          <p class="modal-message">
            Votre table pour <strong>{{ selectedPeople }}</strong> personne{{ selectedPeople > 1 ? 's' : '' }}
            est réservée le <strong>{{ formatSelectedDay() }}</strong> à <strong>{{ selectedTime }}</strong>
            chez <strong>{{ restaurant.name }}</strong>.
          </p>
          <button class="btn-primary" @click="showSuccess = false">Parfait !</button>
        </div>
      </div>
    </transition>
  </div>

  <div v-else class="loading-state">
    <p>Chargement du restaurant...</p>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const restaurant = ref(null)
const isFavorite = ref(false)
const showSuccess = ref(false)

const selectedDay = ref(null)
const selectedTime = ref('11:00')
const selectedPeople = ref(4)

const availableTimes = ['11:00', '11:30', '12:00', '12:30', '13:00', '19:00', '19:30', '20:00', '20:30', '21:00']

const availableDays = computed(() => {
  const days = []
  const dayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  const today = new Date()

  for (let i = 0; i < 6; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      date: d.toISOString().split('T')[0],
      label: dayLabels[d.getDay()],
      number: d.getDate()
    })
  }

  return days
})

const galleryPhotos = computed(() => {
  if (!restaurant.value) return []
  const mainPhoto = restaurant.value.photoUrl || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80'
  return [
    mainPhoto,
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80',
    'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80'
  ]
})

const formatSelectedDay = () => {
  if (!selectedDay.value) return ''
  const d = new Date(selectedDay.value)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

const makeReservation = () => {
  if (!selectedDay.value) {
    selectedDay.value = availableDays.value[0].date
  }
  showSuccess.value = true
}

onMounted(async () => {
  const id = parseInt(route.params.id)

  try {
    const data = await $fetch('/api/restaurants')
    restaurant.value = data.find(r => r.id === id)

    if (availableDays.value.length > 0) {
      selectedDay.value = availableDays.value[0].date
    }
  } catch (error) {
    console.error('Error loading restaurant:', error)
  }
})
</script>

<style scoped>
.reservation-page {
  background: white;
  min-height: 100vh;
  padding-bottom: 120px;
}

.loading-state {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-dark-gray);
}

/* Top Nav */
.top-nav {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  padding: 16px;
  padding-top: calc(env(safe-area-inset-top, 24px) + 16px);
}

.back-btn {
  color: #BA0B2F;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid #BA0B2F;
  background: white;
  cursor: pointer;
}

/* Photo Gallery */
.photo-gallery {
  width: 100%;
  overflow: hidden;
}

.gallery-scroll {
  display: flex;
  gap: 8px;
  padding: 0 16px;
  padding-top: calc(env(safe-area-inset-top, 24px) + 16px);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.gallery-scroll::-webkit-scrollbar {
  display: none;
}

.gallery-item {
  flex-shrink: 0;
  width: 45%;
  height: 180px;
  border-radius: 16px;
  overflow: hidden;
  scroll-snap-align: start;
}

.gallery-item:first-child {
  width: 50%;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Restaurant Info */
.restaurant-info {
  padding: 24px 20px 0;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.info-header h1 {
  font-size: 1.8rem;
  color: var(--color-dark);
  margin-bottom: 4px;
}

.cuisine-label {
  font-size: 0.95rem;
  color: #BA0B2F;
  font-weight: 500;
}

.fav-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid #BA0B2F;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.info-details {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.detail-row p {
  font-size: 0.9rem;
  color: var(--color-dark-gray);
}

.detail-icon {
  font-size: 1rem;
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  font-size: 0.8rem;
  padding: 6px 14px;
  background: transparent;
  color: var(--color-dark);
  border-radius: 20px;
  border: 1px solid var(--color-dark);
  font-weight: 500;
}

/* Divider */
.divider {
  padding: 8px 20px 16px;
}

/* Reservation Section */
.reservation-section {
  padding: 0 20px;
}

.reservation-section h2 {
  font-size: 1.6rem;
  color: var(--color-dark);
  margin-bottom: 24px;
}

.picker-group {
  margin-bottom: 24px;
}

.picker-group h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-dark);
  margin-bottom: 12px;
}

/* Day Grid */
.day-grid {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.day-grid::-webkit-scrollbar {
  display: none;
}

.day-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1.5px solid #e0e0e0;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 60px;
}

.day-btn.active {
  border-color: #BA0B2F;
  color: #BA0B2F;
}

.day-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.day-number {
  font-size: 1.4rem;
  font-weight: 700;
}

/* Time Grid */
.time-grid {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.time-btn {
  padding: 10px 18px;
  border-radius: 20px;
  border: 1.5px solid #e0e0e0;
  background: white;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.time-btn.active {
  border-color: #BA0B2F;
  color: #BA0B2F;
  font-weight: 600;
}

/* People Grid */
.people-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.people-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1.5px solid #e0e0e0;
  background: white;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.people-btn.active {
  border-color: #BA0B2F;
  background: #BA0B2F;
  color: white;
}

/* Reserve Button */
.reserve-btn {
  width: 100%;
  padding: 16px;
  border-radius: 28px;
  border: 1.5px solid #BA0B2F;
  background: transparent;
  color: #BA0B2F;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.2s;
}

.reserve-btn:hover {
  background: #BA0B2F;
  color: white;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-card {
  background: #F4F1EA;
  width: 100%;
  max-width: 320px;
  border-radius: 24px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  border: 2.5px solid #BA0B2F;
}

.modal-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.modal-card h3 {
  font-size: 1.5rem;
  color: #BA0B2F;
  margin-bottom: 12px;
}

.modal-message {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-dark);
  margin-bottom: 24px;
}

.btn-primary {
  width: 100%;
  background: #BA0B2F;
  color: white;
  padding: 14px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
}

/* Animations */
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.serif-italic {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 500;
}
</style>
