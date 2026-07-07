import type { AuthUser, LoginInput, LoginResponse } from '@/types'
import { http } from '@/lib/http'

export const loginUser = (input: LoginInput) =>
  http.post<LoginResponse>('/auth/login', input)

export const getCurrentUser = () => http.get<AuthUser>('/auth/me')
