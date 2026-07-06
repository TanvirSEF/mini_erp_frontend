import { Toaster } from "sonner"
import { AppRoutes } from "@/routes/app-routes"

export function App() {
  return (
    <>
      <AppRoutes />
      <Toaster theme="light" richColors closeButton />
    </>
  )
}

export default App

