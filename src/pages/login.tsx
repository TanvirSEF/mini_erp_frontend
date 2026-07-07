import { useState, type FormEvent } from 'react'
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  PackageCheck,
} from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/auth-context'
import { ApiError } from '@/lib/api-error'

type LocationState = { from?: string }

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const isExpired = searchParams.get('reason') === 'expired'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const from = (location.state as LocationState | null)?.from ?? '/'

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => navigate(from, { replace: true }),
  })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    mutation.mutate({ email, password })
  }

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.isError
        ? 'Login failed. Please try again.'
        : null

  return (
    <main className="light flex min-h-svh items-center justify-center bg-slate-100 px-5 py-10">
      <div className="grid w-full max-w-[960px] overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] md:grid-cols-[1.1fr_1fr]">
        <section className="relative hidden min-h-[540px] overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2a5f8f] md:flex md:flex-col md:justify-between md:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <PackageCheck className="size-5 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              Mini ERP
            </span>
          </div>

          <div className="relative z-10 space-y-3">
            <h2 className="text-[2.5rem] font-extrabold leading-none tracking-tight text-white">
              Welcome
              <br />
              Back
            </h2>
            <p className="max-w-[220px] text-[13px] leading-relaxed text-white/60">
              Manage products, sales, stock alerts, users, and roles from one
              secure workspace.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="h-[3px] w-8 rounded-full bg-white/40" />
            <div className="h-[3px] w-3 rounded-full bg-white/20" />
            <div className="h-[3px] w-3 rounded-full bg-white/20" />
          </div>

          <div className="absolute -bottom-24 -right-24 size-64 rounded-full border border-white/10" />
          <div className="absolute -bottom-16 -right-16 size-48 rounded-full border border-white/[0.06]" />
          <div className="absolute -top-20 -left-20 size-56 rounded-full bg-white/[0.04]" />
        </section>

        <section className="flex min-h-[540px] items-center justify-center bg-white px-7 py-10 sm:px-12">
          <div className="w-full max-w-[340px]">
            <div className="mb-6 flex items-center gap-2 md:hidden">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#1e3a5f]">
                <PackageCheck className="size-4 text-white" />
              </div>
              <span className="text-base font-bold text-slate-900">
                Mini ERP
              </span>
            </div>

            <div className="mb-7">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Sign in to your account
              </h1>
              <p className="mt-1.5 text-[13px] text-slate-500">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isExpired && (
                <p className="rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-[13px] text-blue-700">
                  Your session has expired. Please sign in again.
                </p>
              )}
              {errorMessage && (
                <p
                  className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600"
                  role="alert"
                >
                  {errorMessage}
                </p>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-[13px] font-medium text-slate-700"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-[16px] -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@test.com"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#2a5f8f] focus:bg-white focus:ring-2 focus:ring-[#2a5f8f]/10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-[13px] font-medium text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-[16px] -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter password"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#2a5f8f] focus:bg-white focus:ring-2 focus:ring-[#2a5f8f]/10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1e3a5f] text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#15304f] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
              >
                {mutation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                {mutation.isPending ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
