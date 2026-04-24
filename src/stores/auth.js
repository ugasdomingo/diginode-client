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
  const token             = ref(localStorage.getItem('dn_token') ?? null)
  const user              = ref(token.value ? parseJwt(token.value) : null)
  const mustChangePassword = ref(localStorage.getItem('dn_must_change_pwd') === 'true')

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin  = computed(() => user.value?.role === 'admin')
  const isClient = computed(() => user.value?.role === 'client')

  function setToken(newToken, passwordChangeRequired = false) {
    token.value = newToken
    user.value  = parseJwt(newToken)
    localStorage.setItem('dn_token', newToken)

    mustChangePassword.value = passwordChangeRequired
    if (passwordChangeRequired) {
      localStorage.setItem('dn_must_change_pwd', 'true')
    } else {
      localStorage.removeItem('dn_must_change_pwd')
    }
  }

  function clearPasswordChangeFlag() {
    mustChangePassword.value = false
    localStorage.removeItem('dn_must_change_pwd')
  }

  function logout() {
    token.value             = null
    user.value              = null
    mustChangePassword.value = false
    localStorage.removeItem('dn_token')
    localStorage.removeItem('dn_must_change_pwd')
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isClient,
    mustChangePassword,
    setToken,
    clearPasswordChangeFlag,
    logout,
  }
})
