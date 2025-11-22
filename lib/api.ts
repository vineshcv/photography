import { getToken } from "./auth"

const API_BASE = "/api"

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }))
    throw new ApiError(response.status, error.message || "Request failed")
  }

  return response.json()
}

export const api = {
  auth: {
    register: (data: { email: string; password: string; name: string }) =>
      fetchApi<{ token: string; user: { id: string; email: string; name: string } }>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      ),
    login: (data: { email: string; password: string }) =>
      fetchApi<{ token: string; user: { id: string; email: string; name: string } }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      ),
  },
  events: {
    list: () => fetchApi<any[]>("/events"),
    create: (data: any) => fetchApi<any>("/events", { method: "POST", body: JSON.stringify(data) }),
    get: (id: string) => fetchApi<any>(`/events/${id}`),
    upload: (id: string, formData: FormData) => 
      fetchApi<any>(`/events/${id}/upload`, {
        method: "POST",
        body: formData,
        headers: {} as any 
      }),
    getPhotos: (id: string) => fetchApi<any[]>(`/events/${id}/photos`),
    getPeople: (id: string) => fetchApi<any[]>(`/events/${id}/people`),
    getPersonPhotos: (eventId: string, personId: string) => 
      fetchApi<any[]>(`/events/${eventId}/people/${personId}/photos`),
    getTemplates: (id: string) => fetchApi<any[]>(`/events/${id}/templates`),
    getTemplate: (eventId: string, templateId: string) => 
      fetchApi<any>(`/events/${eventId}/templates/${templateId}`),
    createTemplate: (id: string, data: any) => 
      fetchApi<any>(`/events/${id}/templates`, { method: "POST", body: JSON.stringify(data) }),
    getMyWork: (id: string) => fetchApi<any[]>(`/events/${id}/my-work`),
    createWorkItem: (id: string, data: any) => 
      fetchApi<any>(`/events/${id}/my-work`, { method: "POST", body: JSON.stringify(data) }),
    getExports: (id: string) => fetchApi<any[]>(`/events/${id}/exports`),
    createExport: (id: string, data: any) => 
      fetchApi<any>(`/events/${id}/exports`, { method: "POST", body: JSON.stringify(data) }),
    getHistory: (id: string) => fetchApi<any[]>(`/events/${id}/history`),
    getSettings: (id: string) => fetchApi<any>(`/events/${id}/settings`),
    updateSettings: (id: string, data: any) => 
      fetchApi<any>(`/events/${id}/settings`, { method: "PUT", body: JSON.stringify(data) }),
    submitSelection: (id: string, data: any) =>
      fetchApi<any>(`/events/${id}/submit-selection`, { method: "POST", body: JSON.stringify(data) }),
    getProgress: (id: string) => fetchApi<any>(`/events/${id}/progress`),
    getNotifications: (id: string) => fetchApi<any[]>(`/events/${id}/notifications`),
  },
}
