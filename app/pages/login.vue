<template>
  <Card>
    <h1>Connexion</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <Input
        id="email"
        v-model="email"
        type="email"
        label="Email"
        placeholder="Votre email"
        required
      />
      <Input
        id="password"
        v-model="password"
        type="password"
        label="Mot de passe"
        placeholder="Votre mot de passe"
        required
      />
      <Button type="submit" :disabled="loading" variant="primary">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </Button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p class="register-link">
      Pas de compte ? <NuxtLink to="/register">S'inscrire</NuxtLink>
    </p>
  </Card>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })

    // Store token
    localStorage.setItem('token', response.token)

    // Redirect to home or dashboard
    await navigateTo('/')
  } catch (err: any) {
    error.value = err.data?.statusMessage || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
}

.error-message {
  color: #C8102E;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
}

.register-link {
  text-align: center;
  margin-top: 1rem;
}

.register-link a {
  color: #C8102E;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>