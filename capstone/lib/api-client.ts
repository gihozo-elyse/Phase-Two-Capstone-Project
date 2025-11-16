const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  // Use Record<string, string> to satisfy TS
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint)
  if (!response.ok) {
    let errorMessage = 'Request failed'
    try {
      const error = await response.json()
      errorMessage = error.error || error.message || `HTTP ${response.status}: ${response.statusText}`
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`
    }
    throw new Error(errorMessage)
  }
  return response.json()
}

export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    let errorMessage = 'Request failed'
    try {
      const error = await response.json()
      errorMessage = error.error || error.message || `HTTP ${response.status}: ${response.statusText}`
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`
    }
    throw new Error(errorMessage)
  }
  return response.json()
}

export async function apiPut<T>(endpoint: string, data: any): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }
  return response.json()
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }
  return response.json()
}
