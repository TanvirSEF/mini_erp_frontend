import type { LoginInput, LoginResponse } from '@/types'
import { http } from '@/lib/http'

export const loginUser = (input: LoginInput) =>
  http.post<LoginResponse>('/auth/login', input)
