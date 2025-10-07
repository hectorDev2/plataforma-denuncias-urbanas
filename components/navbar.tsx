"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin, User, LogOut } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { usuario, logout, isAuthenticated } = useAuth()

  const navLinks = isAuthenticated
    ? usuario?.rol === "autoridad"
      ? [
          { href: "/", label: "Inicio" },
          { href: "/denuncias", label: "Denuncias" },
          { href: "/dashboard", label: "Dashboard" },
        ]
      : [
          { href: "/", label: "Inicio" },
          { href: "/denuncias", label: "Denuncias" },
          { href: "/mis-denuncias", label: "Mis Denuncias" },
          { href: "/nueva-denuncia", label: "Reportar" },
        ]
    : [
        { href: "/", label: "Inicio" },
        { href: "/denuncias", label: "Denuncias" },
      ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">Denuncias Urbanas</span>
            <span className="sm:hidden">DU</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span className="text-muted-foreground">{usuario?.nombre}</span>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-sm font-medium transition-colors ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    {usuario?.nombre}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="w-full" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/registro">Registrarse</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
