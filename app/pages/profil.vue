<template>
  <div class="profil-page">
    <!-- Section 1 : Mon Compte -->
    <section class="section-compte">
      <div class="header">
        <h1 class="serif-italic">Mon compte</h1>
        <button class="settings-btn" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>

      <div v-if="profile" class="profile-info">
        <div class="avatar">
          <div class="avatar-placeholder">{{ profile.username?.charAt(0)?.toUpperCase() || '?' }}</div>
        </div>
        <h2 class="serif-italic">{{ profile.username }}</h2>
        <p class="contact-info">{{ profile.email }}</p>
        <p class="member-since">Membre depuis {{ new Date(profile.createdAt).getFullYear() }}</p>
        <div class="level-badge">
          <span>{{ profile.stats.level.emoji }} {{ profile.stats.level.name }}</span>
        </div>
      </div>
      <div v-else class="profile-info">
        <p>Chargement...</p>
      </div>

      <div v-if="profile" class="stats-grid">
        <div class="stat-card">
          <span class="stat-number">{{ profile.stats.checkins }}</span>
          <span class="stat-label">Check-ins</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ profile.stats.uniqueRestaurants }}</span>
          <span class="stat-label">Restaurants</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ profile.stats.tampons }}</span>
          <span class="stat-label">Tampons</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ profile.stats.histoires }}</span>
          <span class="stat-label">Histoires</span>
        </div>
      </div>
    </section>

    <!-- Section 2 : Passeport -->
    <section class="section-passeport">
      <div class="passport-header">
        <h2 class="serif-italic">Passeport Gastronomique</h2>
        <p>Vos check-ins et tampons collectés</p>
      </div>

      <div v-if="passportPages && passportPages.pages && passportPages.pages.length > 0" class="passport-pages">
        <div class="passport-page" v-for="page in passportPages.pages" :key="page.pageNumber">
          <div class="page-number">Page {{ page.pageNumber }}</div>
          <div class="tampons-grid">
            <div
              class="tampon-wrapper"
              v-for="(t, idx) in page.tampons"
              :key="t.id"
              :style="{ transform: `rotate(${(idx % 2 === 0 ? -1 : 1) * (5 + idx * 3)}deg)` }"
            >
              <div class="tampon-circle" :style="{ color: t.color }">
                <span class="tampon-text">{{ t.restaurantName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-passport">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <p>Aucun tampon pour le moment.<br>Faites un check-in dans un restaurant pour commencer !</p>
      </div>
    </section>
  </div>
</template>

<script setup>
const router = useRouter()
const profile = ref(null)
const passportPages = ref(null)

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const [profileData, pagesData] = await Promise.all([
      $fetch('/api/profil', { headers: { Authorization: `Bearer ${token}` } }),
      $fetch('/api/passport/pages', { headers: { Authorization: `Bearer ${token}` } })
    ])
    profile.value = profileData
    passportPages.value = pagesData
  } catch (error) {
    console.error('Error fetching profile:', error)
    if (error.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
  }
})

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.profil-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* SECTION 1 */
.section-compte {
  background-color: var(--color-michelin-red);
  color: var(--color-white);
  padding: 24px 20px 40px;
  padding-top: env(safe-area-inset-top, 24px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 { font-size: 2rem; color: var(--color-white); margin: 0; }
.settings-btn { color: var(--color-white); padding: 8px; background: none; border: none; }

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 32px;
}

.avatar {
  width: 100px; height: 100px; border-radius: 50%;
  border: 3px solid var(--color-white);
  overflow: hidden; margin-bottom: 16px;
  box-shadow: var(--shadow-md);
}

.avatar-placeholder {
  width: 100%; height: 100%;
  background: rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 2.5rem; font-weight: 700;
  font-family: var(--font-serif);
}

.profile-info h2 { font-size: 1.8rem; color: var(--color-white); margin-bottom: 4px; }
.contact-info { font-size: 0.9rem; color: rgba(255, 255, 255, 0.9); margin-bottom: 4px; }
.member-since { font-size: 0.85rem; color: rgba(255, 255, 255, 0.7); font-style: italic; margin-bottom: 12px; }

.level-badge {
  background: rgba(255,255,255,0.2);
  padding: 6px 16px; border-radius: 20px;
  font-size: 0.9rem; font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-card {
  background: rgba(255,255,255,0.15);
  padding: 16px; border-radius: 14px;
  display: flex; flex-direction: column;
  align-items: center; text-align: center;
}

.stat-number { font-size: 1.8rem; font-weight: 700; }
.stat-label { font-size: 0.8rem; opacity: 0.8; margin-top: 4px; }

/* SECTION 2 */
.section-passeport {
  background-color: var(--color-creme);
  flex: 1;
  padding: 40px 20px 100px;
  position: relative;
}

.section-passeport::before {
  content: '';
  position: absolute;
  top: -20px; left: 0; width: 100%; height: 20px;
  background: var(--color-creme);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}

.passport-header { text-align: center; margin-bottom: 30px; }
.passport-header h2 { color: var(--color-michelin-red); font-size: 2rem; margin-bottom: 8px; }
.passport-header p { color: var(--color-dark-gray); font-family: var(--font-serif); font-style: italic; }

.passport-pages { display: flex; flex-direction: column; gap: 24px; }

.passport-page {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 16px; padding: 24px;
  position: relative;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.02);
}

.page-number {
  position: absolute; bottom: 12px; right: 16px;
  font-family: var(--font-serif); font-style: italic;
  color: rgba(0,0,0,0.2);
}

.tampons-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  min-height: 200px;
}

.tampon-wrapper {
  display: flex; align-items: center; justify-content: center;
}

.tampon-circle {
  width: 110px; height: 110px; border-radius: 50%;
  border: 4px double currentColor;
  display: flex; align-items: center; justify-content: center;
  opacity: 0.85; mix-blend-mode: multiply;
}

.tampon-text {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.75rem; font-weight: 700;
  text-align: center; line-height: 1.2;
}

.empty-passport {
  text-align: center;
  color: var(--color-dark-gray);
  padding: 40px 20px;
}
.empty-passport svg { margin-bottom: 16px; color: rgba(0,0,0,0.2); }
.empty-passport p { font-size: 0.95rem; line-height: 1.5; }
</style>
