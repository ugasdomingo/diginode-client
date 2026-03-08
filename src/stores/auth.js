import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

function parseJwt(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('dn_token') ?? null)
  const user  = ref(token.value ? parseJwt(token.value) : null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin  = computed(() => user.value?.role === 'admin')
  const isClient = computed(() => user.value?.role === 'client')

  function setToken(newToken) {
    token.value = newToken
    user.value  = parseJwt(newToken)
    localStorage.setItem('dn_token', newToken)
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem('dn_token')
  }

  return { token, user, isAuthenticated, isAdmin, isClient, setToken, logout }
})
