const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

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
    del:    (path)         => request('DELETE', path),
  }
}
