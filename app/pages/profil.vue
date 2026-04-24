<template>
  <div v-if="loading" class="loading-state">
    <p>Chargement du profil...</p>
  </div>

  <div v-else-if="profile" class="profil-page">
    <div class="top-header">
      <div class="header-main">
        <h1 class="serif-italic">Mon compte</h1>
        <button class="logout-btn" type="button" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
      <svg class="squiggly-line" width="100%" height="12" viewBox="0 0 300 12" preserveAspectRatio="none">
        <path d="M0 6C30 2 60 10 90 6C120 2 150 10 180 6C210 2 240 10 270 6C285 4 295 8 300 6" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.8" />
      </svg>
    </div>

    <section class="user-info-section">
      <div class="profile-main">
        <div class="avatar-container">
          <svg v-if="!form.avatarUrl" class="avatar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#BA0B2F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <img v-else :src="form.avatarUrl" :alt="`Photo de ${displayUsername}`" class="avatar-img" />
        </div>
        <div class="user-details">
          <h2 class="serif-italic">{{ displayUsername }}</h2>
          <p class="user-email">{{ form.email }}</p>
          <p class="user-phone">{{ form.phone || defaultPhonePlaceholder }}</p>
          <p class="member-since">Membre depuis {{ memberSince }}</p>
          <div class="level-pill">{{ profile.stats.level.emoji }} {{ profile.stats.level.name }}</div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <strong>{{ profile.stats.checkins }}</strong>
          <span>Check-ins</span>
        </div>
        <div class="stat-card">
          <strong>{{ profile.stats.uniqueRestaurants }}</strong>
          <span>Restaurants</span>
        </div>
        <div class="stat-card">
          <strong>{{ profile.stats.tampons }}</strong>
          <span>Tampons</span>
        </div>
        <div class="stat-card">
          <strong>{{ profile.stats.histoires }}</strong>
          <span>Histoires</span>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="section-header">
        <h2 class="section-title serif-italic">Informations</h2>
        <p class="section-hint">Ces champs sont relies au backend et sauvegardes en base.</p>
      </div>

      <div class="profile-form-grid">
        <label class="field-card">
          <span>Pseudo</span>
          <input v-model="form.username" type="text" placeholder="Votre pseudo" />
        </label>

        <label class="field-card">
          <span>Email</span>
          <input v-model="form.email" type="email" placeholder="Votre email" />
        </label>

        <label class="field-card">
          <span>Telephone</span>
          <input v-model="form.phone" type="tel" placeholder="+33 6 12 34 56 78" />
        </label>

        <label class="field-card">
          <span>Photo de profil (URL)</span>
          <input v-model="form.avatarUrl" type="url" placeholder="https://..." />
        </label>
      </div>
    </section>

    <section class="content-section">
      <h2 class="section-title serif-italic">Biographie</h2>
      <div class="bio-input-container">
        <textarea v-model="form.bio" placeholder="Racontez votre univers gourmand" class="bio-textarea"></textarea>
      </div>
    </section>

    <section class="content-section">
      <div class="section-header">
        <h2 class="section-title serif-italic">Filtres preferes</h2>
        <p class="section-hint">Ajoutez vos envies, styles ou preferences perso.</p>
      </div>

      <div v-if="form.preferredFilters.length" class="chips-container">
        <button
          v-for="filter in form.preferredFilters"
          :key="filter"
          class="chip chip-button"
          type="button"
          @click="removePreferredFilter(filter)"
        >
          <span>{{ filter }}</span>
          <span class="chip-close">x</span>
        </button>
      </div>
      <p v-else class="empty-text">Aucun filtre enregistre pour le moment.</p>

      <div class="inline-input-row">
        <input
          v-model="newPreferredFilter"
          type="text"
          placeholder="Ajouter un filtre prefere"
          @keydown.enter.prevent="addPreferredFilter"
        />
        <button class="inline-action-btn" type="button" @click="addPreferredFilter">
          Ajouter
        </button>
      </div>
    </section>

    <section class="content-section">
      <div class="section-header">
        <h2 class="section-title serif-italic">Restaurants preferes</h2>
        <p class="section-hint">Choisissez jusqu'a 5 adresses deja presentes dans l'app.</p>
      </div>

      <div class="fav-restaurant-input">
        <input
          v-model="favoriteRestaurantQuery"
          type="text"
          list="favorite-restaurant-options"
          placeholder="Ajouter un restaurant prefere"
          @keydown.enter.prevent="addFavoriteRestaurant"
        />
        <button class="heart-icon-button" type="button" @click="addFavoriteRestaurant">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
        <datalist id="favorite-restaurant-options">
          <option
            v-for="restaurant in availableFavoriteRestaurants"
            :key="restaurant.id"
            :value="restaurant.name"
          />
        </datalist>
      </div>

      <div v-if="selectedFavoriteRestaurants.length" class="chips-container">
        <button
          v-for="restaurant in selectedFavoriteRestaurants"
          :key="restaurant.id"
          class="chip chip-button"
          type="button"
          @click="removeFavoriteRestaurant(restaurant.id)"
        >
          <span>{{ restaurant.name }}</span>
          <span class="chip-close">x</span>
        </button>
      </div>
      <p v-else class="empty-text">Aucun restaurant favori enregistre.</p>
    </section>

    <div class="save-panel">
      <p
        v-if="feedbackMessage"
        :class="['feedback-message', feedbackType === 'error' ? 'is-error' : 'is-success']"
      >
        {{ feedbackMessage }}
      </p>
      <button class="save-btn" type="button" :disabled="saving || !hasChanges" @click="saveProfile">
        {{ saveButtonLabel }}
      </button>
    </div>

    <section class="badges-section">
      <h2 class="badges-main-title serif-italic">Ma collection de badges</h2>

      <div class="badges-container">
        <div
          v-for="collection in profile.badgeCollections"
          :key="collection.chapitreId"
          class="badge-group"
        >
          <h3 class="group-title">Chapitre {{ collection.ordre }} - {{ collection.titre }}</h3>
          <div class="badges-grid">
            <div
              v-for="badge in collection.badges"
              :key="badge.id"
              class="badge"
              :class="{ unlocked: badge.unlocked, locked: !badge.unlocked }"
            >
              <img
                v-if="badge.unlocked && getBadgeImage(collection.ordre, badge.ordre)"
                :src="getBadgeImage(collection.ordre, badge.ordre)!"
                :alt="`Badge ${badge.ordre} du chapitre ${collection.ordre}`"
              />
              <div v-else-if="badge.unlocked" class="unlocked-circle">
                <span class="badge-number">0{{ badge.ordre }}</span>
              </div>
              <div v-else class="locked-circle">
                <svg width="13" height="18" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5 11.2368V13.0263M3.07143 6.76316V4.07895C3.07143 2.10235 4.60645 0.5 6.5 0.5C8.39351 0.5 9.92857 2.10235 9.92857 4.07895V6.76316M2.21429 17.5H10.7857C11.7325 17.5 12.5 16.6989 12.5 15.7105V8.55263C12.5 7.56433 11.7325 6.76316 10.7857 6.76316H2.21429C1.26751 6.76316 0.5 7.56433 0.5 8.55263V15.7105C0.5 16.6989 1.26751 17.5 2.21429 17.5Z" stroke="#F4F1EA" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="loading-state">
    <p>Impossible de charger le profil.</p>
  </div>
</template>

<script setup lang="ts">
type ProfileStats = {
  checkins: number
  uniqueRestaurants: number
  tampons: number
  recompenses: number
  histoires: number
  level: {
    name: string
    emoji: string
  }
}

type FavoriteRestaurant = {
  id: number
  name: string
  photoUrl: string | null
  michelinType: string
  stars: number
}

type BadgeCollection = {
  chapitreId: number
  ordre: number
  titre: string
  badges: Array<{
    id: number
    ordre: number
    unlocked: boolean
    unlockedAt: string | null
  }>
}

type ProfileResponse = {
  id: number
  email: string
  username: string
  phone: string | null
  bio: string | null
  avatarUrl: string | null
  preferredFilters: string[]
  favoriteRestaurantIds: number[]
  favoriteRestaurants: FavoriteRestaurant[]
  createdAt: string
  unlockedHistoireIds: number[]
  badgeCollections: BadgeCollection[]
  stats: ProfileStats
}

type RestaurantOption = {
  id: number
  name: string
}

const badgeBaguette = '/images/badgebaguette.png'
const badgeCroissant = '/images/badgecroissant.png'
const badgeEiffel = '/images/badgeeiffel.png'
const fallbackAvatarUrl = 'https://ui-avatars.com/api/?name=M+P&background=F4F1EA&color=BA0B2F&size=200&font-size=0.4&bold=true&rounded=true'
const defaultPhonePlaceholder = '+33 7 68 45 23 12'
const maxPreferredFilters = 10
const maxFavoriteRestaurants = 5
const badgeImageMap: Record<number, Record<number, string>> = {
  1: {
    1: badgeBaguette,
    2: badgeCroissant,
    3: badgeEiffel,
  },
}

const router = useRouter()
const profile = ref<ProfileResponse | null>(null)
const restaurants = ref<RestaurantOption[]>([])
const loading = ref(true)
const saving = ref(false)
const feedbackMessage = ref('')
const feedbackType = ref<'success' | 'error'>('success')
const newPreferredFilter = ref('')
const favoriteRestaurantQuery = ref('')

const form = reactive({
  username: '',
  email: '',
  phone: '',
  bio: '',
  avatarUrl: '',
  preferredFilters: [] as string[],
  favoriteRestaurantIds: [] as number[],
})

const normalizeText = (value: string) => value.trim().replace(/\s+/g, ' ')
const normalizeOptionalText = (value: string) => {
  const normalizedValue = value.trim()
  return normalizedValue ? normalizedValue : null
}

const buildPayload = () => ({
  username: normalizeText(form.username),
  email: normalizeText(form.email),
  phone: normalizeOptionalText(form.phone),
  bio: normalizeOptionalText(form.bio),
  avatarUrl: normalizeOptionalText(form.avatarUrl),
  preferredFilters: [...new Set(form.preferredFilters.map(normalizeText).filter(Boolean))],
  favoriteRestaurantIds: [...new Set(form.favoriteRestaurantIds)],
})

const buildProfileSnapshot = (data: ProfileResponse) =>
  JSON.stringify({
    username: normalizeText(data.username),
    email: normalizeText(data.email),
    phone: data.phone ?? null,
    bio: data.bio?.trim() || null,
    avatarUrl: data.avatarUrl?.trim() || null,
    preferredFilters: [...new Set(data.preferredFilters.map(normalizeText).filter(Boolean))],
    favoriteRestaurantIds: [...new Set(data.favoriteRestaurantIds)],
  })

const buildFormSnapshot = () => JSON.stringify(buildPayload())

const hasChanges = computed(() => {
  if (!profile.value) {
    return false
  }

  return buildFormSnapshot() !== buildProfileSnapshot(profile.value)
})

const displayUsername = computed(() => normalizeText(form.username) || profile.value?.username || 'Mon compte')
const displayAvatarUrl = computed(() => normalizeOptionalText(form.avatarUrl) || fallbackAvatarUrl)
const memberSince = computed(() => {
  if (!profile.value) {
    return ''
  }

  return new Date(profile.value.createdAt).getFullYear()
})

const availableFavoriteRestaurants = computed(() =>
  restaurants.value.filter((restaurant) => !form.favoriteRestaurantIds.includes(restaurant.id))
)

const selectedFavoriteRestaurants = computed(() => {
  const restaurantById = new Map(restaurants.value.map((restaurant) => [restaurant.id, restaurant]))
  const storedFavoritesById = new Map(
    (profile.value?.favoriteRestaurants ?? []).map((restaurant) => [restaurant.id, restaurant])
  )

  return form.favoriteRestaurantIds
    .map((restaurantId) => restaurantById.get(restaurantId) ?? storedFavoritesById.get(restaurantId))
    .filter((restaurant): restaurant is RestaurantOption | FavoriteRestaurant => Boolean(restaurant))
})

const saveButtonLabel = computed(() => {
  if (saving.value) {
    return 'Enregistrement...'
  }

  return hasChanges.value ? 'Sauvegarder mon profil' : 'Profil a jour'
})

const getBadgeImage = (chapitreOrdre: number, badgeOrdre: number) =>
  badgeImageMap[chapitreOrdre]?.[badgeOrdre] ?? null

const setFeedback = (type: 'success' | 'error', message: string) => {
  feedbackType.value = type
  feedbackMessage.value = message
}

const clearFeedback = () => {
  feedbackMessage.value = ''
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')

  if (!token) {
    router.push('/login')
    return null
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

const handleAuthError = (error: any) => {
  const statusCode = error?.statusCode ?? error?.status ?? error?.data?.statusCode

  if (statusCode === 401) {
    localStorage.removeItem('token')
    router.push('/login')
    return true
  }

  return false
}

const syncFormWithProfile = (data: ProfileResponse) => {
  form.username = data.username
  form.email = data.email
  form.phone = data.phone ?? ''
  form.bio = data.bio ?? ''
  form.avatarUrl = data.avatarUrl ?? ''
  form.preferredFilters = [...data.preferredFilters]
  form.favoriteRestaurantIds = [...data.favoriteRestaurantIds]
}

const loadRestaurants = async () => {
  try {
    const response = await $fetch<Array<{ id: number; name: string }>>('/api/restaurants')
    restaurants.value = response.map(({ id, name }) => ({ id, name }))
  } catch {
    restaurants.value = []
  }
}

const loadProfile = async () => {
  const headers = getAuthHeaders()

  if (!headers) {
    return
  }

  loading.value = true

  try {
    const profileData = await $fetch<ProfileResponse>('/api/profil', {
      headers,
    })

    profile.value = profileData
    syncFormWithProfile(profileData)
    await loadRestaurants()
  } catch (error: any) {
    if (!handleAuthError(error)) {
      setFeedback('error', 'Impossible de charger le profil.')
    }
  } finally {
    loading.value = false
  }
}

const addPreferredFilter = () => {
  const normalizedFilter = normalizeText(newPreferredFilter.value)

  if (!normalizedFilter) {
    return
  }

  if (form.preferredFilters.some((filter) => filter.toLowerCase() === normalizedFilter.toLowerCase())) {
    setFeedback('error', 'Ce filtre est deja present.')
    return
  }

  if (form.preferredFilters.length >= maxPreferredFilters) {
    setFeedback('error', `Vous pouvez enregistrer jusqu'a ${maxPreferredFilters} filtres.`)
    return
  }

  form.preferredFilters = [...form.preferredFilters, normalizedFilter]
  newPreferredFilter.value = ''
  clearFeedback()
}

const removePreferredFilter = (filterToRemove: string) => {
  form.preferredFilters = form.preferredFilters.filter((filter) => filter !== filterToRemove)
  clearFeedback()
}

const addFavoriteRestaurant = () => {
  const normalizedQuery = favoriteRestaurantQuery.value.trim().toLowerCase()

  if (!normalizedQuery) {
    return
  }

  if (form.favoriteRestaurantIds.length >= maxFavoriteRestaurants) {
    setFeedback('error', `Vous pouvez enregistrer jusqu'a ${maxFavoriteRestaurants} restaurants favoris.`)
    return
  }

  const matchingRestaurant =
    availableFavoriteRestaurants.value.find(
      (restaurant) => restaurant.name.trim().toLowerCase() === normalizedQuery
    ) ??
    availableFavoriteRestaurants.value.find((restaurant) =>
      restaurant.name.trim().toLowerCase().includes(normalizedQuery)
    )

  if (!matchingRestaurant) {
    setFeedback('error', "Choisissez un restaurant existant depuis la liste de l'application.")
    return
  }

  form.favoriteRestaurantIds = [...form.favoriteRestaurantIds, matchingRestaurant.id]
  favoriteRestaurantQuery.value = ''
  clearFeedback()
}

const removeFavoriteRestaurant = (restaurantId: number) => {
  form.favoriteRestaurantIds = form.favoriteRestaurantIds.filter((id) => id !== restaurantId)
  clearFeedback()
}

const saveProfile = async () => {
  if (!hasChanges.value) {
    return
  }

  const headers = getAuthHeaders()

  if (!headers) {
    return
  }

  saving.value = true
  clearFeedback()

  try {
    const updatedProfile = await $fetch<ProfileResponse>('/api/profil', {
      method: 'PUT',
      headers,
      body: buildPayload(),
    })

    profile.value = updatedProfile
    syncFormWithProfile(updatedProfile)
    setFeedback('success', 'Profil sauvegarde avec succes.')
  } catch (error: any) {
    if (!handleAuthError(error)) {
      setFeedback(
        'error',
        error?.data?.statusMessage || error?.statusMessage || "Impossible d'enregistrer le profil."
      )
    }
  } finally {
    saving.value = false
  }
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profil-page {
  background-color: #ba0b2f;
  min-height: 100vh;
  padding: 24px 24px 120px;
  color: white;
  display: flex;
  flex-direction: column;
  padding-top: calc(env(safe-area-inset-top, 24px) + 20px);
}

.loading-state {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ba0b2f;
  color: white;
}

.top-header {
  margin-bottom: 40px;
}

.header-main {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.top-header h1 {
  font-size: 2.2rem;
  margin-bottom: 4px;
}

.logout-btn {
  position: absolute;
  right: 0;
  background: transparent;
  border: none;
  color: white;
  opacity: 0.8;
  padding: 8px;
}

.squiggly-line {
  display: block;
  width: 100%;
  margin-top: 4px;
}

.user-info-section {
  margin-bottom: 40px;
}

.profile-main {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 16px;
}

.avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid white;
  overflow: hidden;
  flex-shrink: 0;
  background: #F4F1EA;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  width: 44px;
  height: 44px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.user-details h2 {
  font-size: 1.6rem;
  margin-bottom: 2px;
}

.user-email,
.user-phone {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0;
}

.member-since {
  font-size: 0.85rem;
  opacity: 0.7;
  margin-top: 4px;
}

.level-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  margin-top: 8px;
  font-size: 0.9rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 24px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 22px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-card strong {
  font-size: 1.5rem;
}

.stat-card span {
  font-size: 0.9rem;
  opacity: 0.85;
}

.content-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 1.8rem;
  margin: 0;
}

.section-hint {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.profile-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.field-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-card span {
  font-size: 0.9rem;
  opacity: 0.85;
}

.field-card input,
.inline-input-row input,
.fav-restaurant-input input {
  width: 100%;
  height: 48px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 24px;
  padding: 0 18px;
  color: white;
  font-size: 0.95rem;
  outline: none;
}

.field-card input::placeholder,
.inline-input-row input::placeholder,
.fav-restaurant-input input::placeholder,
.bio-textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.bio-input-container {
  width: 100%;
}

.bio-textarea {
  width: 100%;
  min-height: 110px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 24px;
  padding: 16px 20px;
  color: white;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  resize: vertical;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 8px 16px;
  border: 1px solid white;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  background: transparent;
  color: white;
}

.chip-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.chip-close {
  opacity: 0.7;
}

.empty-text {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.75;
}

.inline-input-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  margin-top: 14px;
}

.inline-action-btn,
.save-btn,
.heart-icon-button {
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.inline-action-btn {
  padding: 0 18px;
  background: white;
  color: #ba0b2f;
  font-weight: 600;
}

.fav-restaurant-input {
  position: relative;
}

.fav-restaurant-input input {
  padding-right: 54px;
}

.heart-icon-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 36px;
}

.feedback-message {
  margin: 0;
  font-size: 0.9rem;
}

.feedback-message.is-success {
  color: #ffe7b0;
}

.feedback-message.is-error {
  color: #ffd0d7;
}

.save-btn {
  height: 50px;
  background: white;
  color: #ba0b2f;
  font-size: 1rem;
  font-weight: 700;
}

.inline-action-btn:hover,
.save-btn:hover,
.heart-icon-button:hover,
.logout-btn:hover {
  opacity: 0.9;
}

.inline-action-btn:disabled,
.save-btn:disabled,
.heart-icon-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.badges-section {
  margin-top: 8px;
}

.badges-main-title {
  font-size: 1.8rem;
  margin-bottom: 24px;
}

.badges-container {
  background-color: #f4f1ea;
  border-radius: 32px;
  padding: 32px 24px;
  color: #1b1b1b;
}

.badge-group {
  margin-bottom: 32px;
}

.badge-group:last-child {
  margin-bottom: 0;
}

.group-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 12px;
  border-bottom: 1.5px solid #1b1b1b;
  padding-bottom: 4px;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-top: 12px;
}

.badge {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge.unlocked img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.badge.locked {
  position: relative;
}

.locked-circle {
  width: 60px;
  height: 60px;
  background: #ba0b2f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(186, 11, 47, 0.4);
  opacity: 0.7;
}

.unlocked-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f6e3a1, #d9ab36);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 18px rgba(217, 171, 54, 0.35);
  color: #7b1022;
}

.badge-number {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.locked-circle svg {
  width: 13px;
  height: 18px;
}

.serif-italic {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 500;
}

@media (max-width: 720px) {
  .profile-main {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-form-grid,
  .inline-input-row {
    grid-template-columns: 1fr;
  }
}
</style>
