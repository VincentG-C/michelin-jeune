<template>
  <div class="page-container">
    <slot />
    
    <nav class="bottom-nav">
      <NuxtLink to="/histoires" class="nav-item" active-class="active">
        <img src="/images/icon-histoire.png" alt="Histoire" class="nav-icon" />
        <span>Histoire</span>
      </NuxtLink>
      
      <NuxtLink to="/" class="nav-item" active-class="active" exact-active-class="active">
        <img src="/images/icon-map.svg" alt="Map" class="nav-icon" />
        <span>Map</span>
      </NuxtLink>
      
      <NuxtLink to="/profil" class="nav-item" active-class="active">
        <img src="/images/icon-profil.svg" alt="Profil" class="nav-icon" />
        <span>Profil</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: var(--color-white);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom, 16px);
  z-index: 1000;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--color-dark-gray);
  transition: all 0.3s ease;
  width: 33%;
  height: 100%;
}

.nav-item .nav-icon {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  width: 24px;
  height: 24px;
}

.nav-item span {
  font-size: 11px;
  font-weight: 500;
  font-family: var(--font-sans);
}

.nav-item.active {
  color: var(--color-michelin-red);
}

.nav-item.active .nav-icon {
  transform: translateY(-4px) scale(1.1);
}

.nav-item.active span {
  font-weight: 600;
}
</style>
