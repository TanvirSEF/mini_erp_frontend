import type { ComponentType, ReactNode } from 'react'

type Props = {
  label: string
  value: ReactNode
  icon?: ComponentType<{ className?: string }>
  className?: string
  iconClassName?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  className,
  iconClassName,
}: Props) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${className ?? ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[13px] font-medium text-slate-500">{label}</p>
          <div className="text-2xl font-bold tabular-nums text-slate-900">
            {value}
          </div>
        </div>
        {Icon && (
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClassName ?? 'bg-[#1e3a5f]/10 text-[#1e3a5f]'}`}
          >
            <Icon className="size-5" />
          </div>
        )}
      </div>
    </div>
  )
}
