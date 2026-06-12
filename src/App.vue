<template>
  <RouterView />
  <AppToast />
</template>

<script setup>
import { onMounted } from 'vue'
import AppToast from '@/components/ui/AppToast.vue'
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()

onMounted(() => {
  // Show a notice after a 401 forced a reload to /login (F6-6).
  if (sessionStorage.getItem('dn_session_expired')) {
    sessionStorage.removeItem('dn_session_expired')
    toast.warning('Tu sesión expiró. Inicia sesión de nuevo.')
  }
})
</script>
