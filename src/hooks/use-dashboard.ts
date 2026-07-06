import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getDashboardStats } from '@/api/dashboard'
import { queryKeys } from '@/api/query-keys'
import { createSocket } from '@/lib/socket'
import { ApiError } from '@/lib/api-error'

export const useDashboard = () =>
  useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: getDashboardStats,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && (error.status === 403 || error.status === 401)) {
        return false
      }
      return failureCount < 3
    },
  })

export const useDashboardSocket = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = createSocket()
    if (!socket) return

    const invalidate = () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })

    socket.on('sale:created', invalidate)
    socket.on('low-stock', invalidate)

    return () => {
      socket.off('sale:created', invalidate)
      socket.off('low-stock', invalidate)
      socket.disconnect()
    }
  }, [queryClient])
}
