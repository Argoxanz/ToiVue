import http from './http'

export async function healthCheck(): Promise<{ status: string }> {
  const { data } = await http.get<{ status: string }>('/health')
  return data
}


