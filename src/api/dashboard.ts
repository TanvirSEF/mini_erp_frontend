import type { DashboardStats } from '@/types'
import { http } from '@/lib/http'

export const getDashboardStats = () => http.get<DashboardStats>('/dashboard')
