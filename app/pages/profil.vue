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

      <div class="profile-info">
        <div class="avatar">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" alt="Avatar" />
        </div>
        <h2 class="serif-italic">Marie Dupont</h2>
        <p class="contact-info">marie.dupont@email.com • +33 6 12 34 56 78</p>
        <p class="member-since">Membre depuis 2025</p>
      </div>

      <div class="editable-fields">
        <div class="field">
          <label>Biographie</label>
          <p>Exploratrice de saveurs, toujours à la recherche du meilleur bistrot de quartier ! 🍷</p>
        </div>
        <div class="field">
          <label>Restaurant préféré</label>
          <p>Bistrot des Fables</p>
        </div>
        <div class="field">
          <label>Filtres préférés</label>
          <div class="tags">
            <span class="tag">Pépite caché</span>
            <span class="tag">Bib Gourmand</span>
            <span class="tag">Ouvert tard</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 2 : Passeport -->
    <section class="section-passeport">
      <div class="passport-header">
        <h2 class="serif-italic">Passeport Gastronomique</h2>
        <p>Vos check-ins et tampons collectés</p>
      </div>

      <div class="passport-pages">
        <div class="passport-page">
          <div class="page-number">Page 1</div>
          
          <div class="tampons-grid">
            <div class="tampon-wrapper" style="transform: rotate(-5deg) translate(10px, 10px);">
              <div class="tampon-circle red">
                <span class="tampon-text">Bistrot<br>des Fables</span>
              </div>
            </div>
            
            <div class="tampon-wrapper" style="transform: rotate(8deg) translate(-5px, 20px);">
              <div class="tampon-circle green">
                <span class="tampon-text">Table<br>de Mee</span>
              </div>
            </div>
            
            <div class="tampon-wrapper" style="transform: rotate(-12deg) translate(15px, -5px);">
              <div class="tampon-circle blue">
                <span class="tampon-text">Cloche<br>d'Or</span>
              </div>
            </div>
            
            <div class="tampon-wrapper locked">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const router = useRouter()

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

.header h1 {
  font-size: 2rem;
  color: var(--color-white);
  margin: 0;
}

.settings-btn {
  color: var(--color-white);
  padding: 8px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 32px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid var(--color-white);
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: var(--shadow-md);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info h2 {
  font-size: 1.8rem;
  color: var(--color-white);
  margin-bottom: 4px;
}

.contact-info {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
}

.member-since {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

.editable-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 12px;
}

.field label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.field p {
  font-size: 1rem;
  line-height: 1.4;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
}

/* SECTION 2 */
.section-passeport {
  background-color: var(--color-creme);
  flex: 1;
  padding: 40px 20px 100px;
  position: relative;
  background-image: url('https://www.transparenttextures.com/patterns/cream-paper.png');
}

.section-passeport::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 0;
  width: 100%;
  height: 20px;
  background: var(--color-creme);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}

.passport-header {
  text-align: center;
  margin-bottom: 30px;
}

.passport-header h2 {
  color: var(--color-michelin-red);
  font-size: 2rem;
  margin-bottom: 8px;
}

.passport-header p {
  color: var(--color-dark-gray);
  font-family: var(--font-serif);
  font-style: italic;
}

.passport-pages {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.passport-page {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.02);
}

.page-number {
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-family: var(--font-serif);
  font-style: italic;
  color: rgba(0,0,0,0.2);
}

.tampons-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
  aspect-ratio: 1;
}

.tampon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tampon-circle {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 4px double currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
  mix-blend-mode: multiply;
}

.tampon-circle.red { color: var(--color-michelin-red); }
.tampon-circle.green { color: #2e8b57; }
.tampon-circle.blue { color: #4169e1; }

.tampon-text {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
}

.tampon-wrapper.locked {
  background: rgba(0,0,0,0.05);
  border: 2px dashed rgba(0,0,0,0.1);
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin: auto;
  color: rgba(0,0,0,0.2);
}
</style>
