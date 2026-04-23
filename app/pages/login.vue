<template>
  <div class="auth-page">
    
    <!-- SPLASH SCREEN -->
    <transition name="fade">
      <div v-if="mode === 'splash'" class="splash-screen">
        <div class="splash-content">
          <div class="logo">
            <!-- Asset attendu : logo-bibendum.png -->
            <img src="/images/logo-bibendum.png" alt="Bibendum" v-if="assetsLoaded" />
            <div v-else class="placeholder-box">Logo Bibendum</div>
          </div>
          <h1 class="splash-title">Bib Gourmand</h1>
        </div>
      </div>
    </transition>

    <!-- MAIN APP FLOW -->
    <transition name="fade">
      <div v-if="mode !== 'splash'" class="main-view">
        
        <div class="auth-header">
          <h1 class="auth-title">S'inscrire ou se connecter</h1>
          <!-- Asset attendu : squiggle-line.svg -->
          <img src="/images/squiggle-line.svg" alt="" class="squiggly-line" v-if="assetsLoaded" />
          <div v-else class="placeholder-line"></div>
        </div>

        <transition name="fade-slide" mode="out-in">
          
          <!-- SELECT MODE -->
          <div v-if="mode === 'select'" class="select-view" key="select">
            <p class="description">
              Vous inscrire vous permet de personnaliser votre<br>expérience, créer et sauvegarder des listes, gérer vos<br>réservations et plus encore.
            </p>

            <p class="continue-text">Continuer avec :</p>

            <div class="buttons">
              <button class="auth-btn" @click="mode = 'register'">
                <span class="icon">
                  <!-- Asset attendu : icon-email.svg -->
                  <img src="/images/icon-email.svg" alt="Email" v-if="assetsLoaded" />
                  <span v-else>✉️</span>
                </span>
                <span class="btn-text">Email</span>
              </button>
              
              <button class="auth-btn" @click="alertNotImplemented">
                <span class="icon">
                  <!-- Asset attendu : icon-apple.svg -->
                  <img src="/images/icon-apple.svg" alt="Apple" v-if="assetsLoaded" />
                  <span v-else>🍎</span>
                </span>
                <span class="btn-text">Apple</span>
              </button>
              
              <button class="auth-btn" @click="alertNotImplemented">
                <span class="icon">
                  <!-- Asset attendu : icon-google.svg -->
                  <img src="/images/icon-google.svg" alt="Google" v-if="assetsLoaded" />
                  <span v-else>G</span>
                </span>
                <span class="btn-text">Google</span>
              </button>
            </div>

            <p class="legal-text">
              En m'inscrivant,<br>
              j'accepte les Conditions Générales<br>
              Politique de confidentialité
            </p>
          </div>

          <!-- REGISTER MODE -->
          <div v-if="mode === 'register'" class="register-view" key="register">
            <form @submit.prevent="handleRegister" class="register-form">
              <div class="input-group">
                <label>Prénom</label>
                <input type="text" placeholder="Prénom" v-model="form.firstname" required />
              </div>
              
              <div class="input-group">
                <label>Nom</label>
                <input type="text" placeholder="Nom" v-model="form.lastname" required />
              </div>

              <div class="input-group">
                <label>Email</label>
                <input type="email" placeholder="Email" v-model="form.email" required />
              </div>
              
              <div class="input-group">
                <label>Mot de Passe</label>
                <input type="password" placeholder="Mot de Passe" v-model="form.password" required />
              </div>

              <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>

              <button type="submit" class="submit-btn" :disabled="loading">
                {{ loading ? 'Chargement...' : 'Continuer' }}
              </button>

              <p class="toggle-mode" @click="switchMode('login')">Déjà inscrit ? Se connecter</p>
            </form>
          </div>

          <!-- LOGIN MODE -->
          <div v-if="mode === 'login'" class="register-view" key="login">
            <form @submit.prevent="handleLogin" class="register-form">
              <div class="input-group">
                <label>Email</label>
                <input type="email" placeholder="Email" v-model="form.email" required />
              </div>
              
              <div class="input-group">
                <label>Mot de Passe</label>
                <input type="password" placeholder="Mot de Passe" v-model="form.password" required />
              </div>

              <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>

              <button type="submit" class="submit-btn" :disabled="loading">
                {{ loading ? 'Connexion...' : 'Se connecter' }}
              </button>

              <p class="toggle-mode" @click="switchMode('register')">Pas de compte ? S'inscrire</p>
            </form>
          </div>
          
        </transition>

        <!-- Illustration (always at bottom) -->
        <div class="illustration-bottom">
          <!-- Asset attendu : illustration-cocktail.png -->
          <img src="/images/illustration-cocktail.png" alt="Cocktail" v-if="assetsLoaded" />
          <div v-else class="placeholder-box cocktail-placeholder">Illustration Cocktail</div>
        </div>

      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const mode = ref('splash') // 'splash', 'select', 'register', 'login'
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()
const assetsLoaded = ref(true) // Tous les assets sont maintenant fournis

const form = ref({
  firstname: '',
  lastname: '',
  email: '',
  password: ''
})

onMounted(() => {
  // Check auth
  const token = localStorage.getItem('token')
  if (token) {
    router.push('/')
    return
  }

  // Splash timeout
  setTimeout(() => {
    mode.value = 'select'
  }, 2000)
})

const switchMode = (newMode: string) => {
  mode.value = newMode
  errorMessage.value = ''
  form.value.password = ''
}

const alertNotImplemented = () => {
  alert("Ce mode de connexion n'est pas disponible pour la démo. Veuillez utiliser l'Email.")
}

const handleRegister = async () => {
  errorMessage.value = ''
  if (!form.value.firstname || !form.value.lastname || !form.value.email || !form.value.password) {
    errorMessage.value = 'Veuillez remplir tous les champs.'
    return
  }

  loading.value = true
  try {
    const res: any = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email: form.value.email,
        password: form.value.password,
        firstname: form.value.firstname,
        lastname: form.value.lastname
      }
    })

    if (res.token) {
      localStorage.setItem('token', res.token)
      router.push('/')
    }
  } catch (error: any) {
    console.error('Register error', error)
    if (error.status === 409 || error.data?.message?.includes('already exists')) {
      errorMessage.value = 'Cet email est déjà utilisé.'
    } else {
      errorMessage.value = error.data?.message || 'Erreur lors de la création du compte.'
    }
  } finally {
    loading.value = false
  }
}

const handleLogin = async () => {
  errorMessage.value = ''
  if (!form.value.email || !form.value.password) {
    errorMessage.value = 'Veuillez remplir tous les champs.'
    return
  }

  loading.value = true
  try {
    const res: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.value.email,
        password: form.value.password
      }
    })

    if (res.token) {
      localStorage.setItem('token', res.token)
      router.push('/')
    }
  } catch (error: any) {
    console.error('Login error', error)
    if (error.status === 401 || error.data?.message?.includes('Invalid credentials')) {
      errorMessage.value = 'Email ou mot de passe incorrect.'
    } else {
      errorMessage.value = error.data?.message || 'Erreur lors de la connexion.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  background-color: var(--color-michelin-red);
  color: white;
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  font-family: var(--font-sans);
}

/* SPLASH */
.splash-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  background-color: var(--color-michelin-red);
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  animation: pulse 2s infinite ease-in-out;
}

.logo img {
  width: 130px;
  height: auto;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.splash-title {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 2.8rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  margin: 0;
}

/* MAIN VIEW */
.main-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 24px;
}

.auth-header {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.auth-title {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 2.2rem;
  font-weight: 400;
  text-align: center;
  margin: 0;
}

.squiggly-line {
  opacity: 0.9;
  width: 90%;
  max-width: 320px;
  margin: 0 auto;
}

/* SELECT VIEW */
.select-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.description {
  text-align: center;
  font-size: 0.85rem;
  line-height: 1.5;
  opacity: 0.9;
  margin-bottom: 36px;
  font-weight: 300;
  padding: 0 10px;
}

.continue-text {
  font-size: 0.9rem;
  margin-bottom: 20px;
  font-weight: 300;
}

.buttons {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.auth-btn {
  display: flex;
  align-items: center;
  width: 100%;
  height: 52px;
  border: 1px solid white;
  border-radius: 26px;
  background: transparent;
  color: white;
  position: relative;
  transition: background 0.2s;
}

.auth-btn:active {
  background: rgba(255, 255, 255, 0.1);
}

.auth-btn .icon {
  position: absolute;
  left: 24px;
  display: flex;
  align-items: center;
}

.auth-btn .icon img {
  width: 22px;
  height: 22px;
}

.auth-btn .btn-text {
  flex: 1;
  text-align: center;
  font-size: 1rem;
  font-weight: 400;
}

.legal-text {
  text-align: center;
  font-size: 0.75rem;
  line-height: 1.6;
  opacity: 0.8;
  font-weight: 300;
}

/* REGISTER / LOGIN VIEW */
.register-view {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.8rem;
  font-weight: 400;
  letter-spacing: 0px;
}

.input-group input {
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  background: transparent;
  color: white;
  padding: 0 24px;
  font-size: 0.95rem;
  font-family: var(--font-sans);
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.input-group input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.05);
  border-color: white;
}

.error-msg {
  color: #ffcccc;
  font-size: 0.85rem;
  text-align: center;
  margin-top: -4px;
}

.submit-btn {
  height: 48px;
  border-radius: 24px;
  background: white;
  color: var(--color-michelin-red);
  font-weight: 600;
  font-size: 1rem;
  margin-top: 10px;
  transition: opacity 0.2s;
  border: none;
}

.submit-btn:active {
  opacity: 0.8;
}
.submit-btn:disabled {
  opacity: 0.5;
}

.toggle-mode {
  text-align: center;
  font-size: 0.85rem;
  text-decoration: underline;
  opacity: 0.8;
  margin-top: 4px;
  cursor: pointer;
}

/* PLACEHOLDERS for missing assets */
.placeholder-box {
  width: 80px;
  height: 80px;
  border: 2px dashed rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.8rem;
  border-radius: 50%;
}
.cocktail-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 10px;
}
.placeholder-line {
  width: 100%;
  height: 2px;
  background: rgba(255,255,255,0.5);
  max-width: 200px;
}

/* ILLUSTRATION */
.illustration-bottom {
  margin-top: auto;
  display: flex;
  justify-content: center;
  padding-bottom: 30px;
  padding-top: 10px;
  opacity: 0.9;
}
.illustration-bottom img {
  max-height: 130px;
}

/* ANIMATIONS */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>