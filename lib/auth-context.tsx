"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Usuario } from "./types"
import { mockUsuarios } from "@/data/mock-data"

interface AuthContextType {
  usuario: Usuario | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario")
    if (storedUser) {
      try {
        setUsuario(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("usuario")
      }
    }
    setIsLoaded(true)
  }, [])

  const login = (email: string, password: string): boolean => {
    // Simulación de login - en producción esto sería una llamada a API
    const usuarioEncontrado = mockUsuarios.find((u) => u.email === email)

    if (usuarioEncontrado) {
      setUsuario(usuarioEncontrado)
      localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado))
      return true
    }

    return false
  }

  const logout = () => {
    setUsuario(null)
    localStorage.removeItem("usuario")
  }

  if (!isLoaded) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        isAuthenticated: !!usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
