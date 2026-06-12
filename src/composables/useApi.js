const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

// El JWT se guarda en localStorage (no en cookie HttpOnly) como compromiso
// consciente: la API es stateless y no emite cookies. El vector XSS que esto
// implica está mitigado al sanitizar todo v-html con DOMPurify (F0-5). Migrar a
// cookie HttpOnly + sameSite=lax + CSRF requeriría cambios coordinados en la API.
function getToken() {
  return localStorage.getItem('dn_token')
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' }

  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (body !== null) options.body = JSON.stringify(body)

  const res = await fetch(`${BASE_URL}${path}`, options)

  if (res.status === 401) {
    localStorage.removeItem('dn_token')
    // Flag picked up after the reload to show a "session expired" toast (F6-6).
    sessionStorage.setItem('dn_session_expired', '1')
    window.location.href = '/login'
    return
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message = data?.message ?? `Error ${res.status}`
    throw new Error(message)
  }

  return data
}

export function useApi() {
  return {
    get:    (path)         => request('GET',    path),
    post:   (path, body)   => request('POST',   path, body),
    patch:  (path, body)   => request('PATCH',  path, body),
    put:    (path, body)   => request('PUT',    path, body),
    del:    (path)         => request('DELETE', path),
  }
}
