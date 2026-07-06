import { Toaster } from "sonner"
import { useTheme } from "@/components/theme-provider"
import { AppRoutes } from "@/routes/app-routes"

export function App() {
  const { theme } = useTheme()

  return (
    <>
      <AppRoutes />
      <Toaster theme={theme} richColors closeButton />
    </>
  )
}

export default App
