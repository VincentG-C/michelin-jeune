<template>
  <div class="page-container">
    <slot />
    
    <nav class="bottom-nav">
      <NuxtLink to="/histoires" class="nav-item" active-class="active">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m2 16 9 6 9-6"/>
          <path d="M2 12l9 6 9-6"/>
          <path d="M11 2L2 8l9 6 9-6-9-6z"/>
        </svg>
        <span>Histoire</span>
      </NuxtLink>
      
      <NuxtLink to="/" class="nav-item" active-class="active" exact-active-class="active">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="10" r="3"/>
          <path d="M12 21c-4-4-8-9-8-13a8 8 0 0 1 16 0c0 4-4 9-8 13z"/>
        </svg>
        <span>Map</span>
      </NuxtLink>
      
      <NuxtLink to="/profil" class="nav-item" active-class="active">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
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

.nav-item svg {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.nav-item span {
  font-size: 11px;
  font-weight: 500;
  font-family: var(--font-sans);
}

.nav-item.active {
  color: var(--color-michelin-red);
}

.nav-item.active svg {
  transform: translateY(-4px) scale(1.1);
  stroke-width: 2.5px;
}

.nav-item.active span {
  font-weight: 600;
}
</style>
