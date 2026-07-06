import type { AuthUser, LoginInput, LoginResponse, RegisterInput } from '@/types'
import { http } from '@/lib/http'

export const loginUser = (input: LoginInput) =>
  http.post<LoginResponse>('/auth/login', input)

export const registerUser = (input: RegisterInput) =>
  http.post<AuthUser>('/auth/register', input)
