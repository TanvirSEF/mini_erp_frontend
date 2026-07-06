import type { ComponentType, ReactNode } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Props = {
  label: string
  value: ReactNode
  icon?: ComponentType<{ className?: string }>
  className?: string
}

export function StatCard({ label, value, icon: Icon, className }: Props) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        {Icon && (
          <CardAction>
            <Icon className="size-4 text-muted-foreground" />
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  )
}
