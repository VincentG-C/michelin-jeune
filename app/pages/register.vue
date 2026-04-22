<template>
  <Card>
    <h1>Inscription</h1>
    <form @submit.prevent="handleRegister" class="register-form">
      <Input
        id="username"
        v-model="username"
        type="text"
        label="Nom d'utilisateur"
        placeholder="Votre nom d'utilisateur"
        required
      />
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
      <Input
        id="confirmPassword"
        v-model="confirmPassword"
        type="password"
        label="Confirmer le mot de passe"
        placeholder="Confirmez votre mot de passe"
        required
      />
      <Button type="submit" :disabled="loading" variant="primary">
        {{ loading ? 'Inscription...' : "S'inscrire" }}
      </Button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p class="login-link">
      Déjà un compte ? <NuxtLink to="/login">Se connecter</NuxtLink>
    </p>
  </Card>
</template>

<script setup lang="ts">
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        username: username.value,
        email: email.value,
        password: password.value,
      },
    })

    // Store token
    localStorage.setItem('token', response.token)

    // Redirect to home
    await navigateTo('/')
  } catch (err: any) {
    error.value = err.data?.statusMessage || 'Erreur lors de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
}

.error-message {
  color: #C8102E;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
}

.login-link a {
  color: #C8102E;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>