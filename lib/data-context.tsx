"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockDenuncias } from "@/data/mock-data"
import type { Denuncia } from "@/lib/types"

interface DataContextType {
    denuncias: Denuncia[]
    addDenuncia: (denuncia: Denuncia) => void
    removeDenuncia: (id: string) => void
    getDenunciaById: (id: string) => Denuncia | undefined
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
    const [denuncias, setDenuncias] = useState<Denuncia[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from local storage on mount
    useEffect(() => {
        const storedDenuncias = localStorage.getItem("denuncias")
        const storedDeletedIds = localStorage.getItem("deleted_denuncias")

        try {
            const deletedIds = storedDeletedIds ? JSON.parse(storedDeletedIds) : []
            const parsed = storedDenuncias ? JSON.parse(storedDenuncias) : []

            const validStored = Array.isArray(parsed) ? parsed : []

            // Filter mock data by excluding deleted ones
            const availableMock = mockDenuncias.filter(m => !deletedIds.includes(m.id))

            // Combine
            const combined = [...availableMock, ...validStored.filter((d: Denuncia) => !mockDenuncias.some(m => m.id === d.id))]

            setDenuncias(combined)
        } catch (error) {
            console.error("Error parsing stored data:", error)
            setDenuncias(mockDenuncias)
        }
        setIsLoaded(true)
    }, [])

    const addDenuncia = (newDenuncia: Denuncia) => {
        setDenuncias((prev) => {
            const updated = [newDenuncia, ...prev]
            localStorage.setItem("denuncias", JSON.stringify(updated.filter(d => !mockDenuncias.some(m => m.id === d.id))))
            return updated
        })
    }

    const removeDenuncia = (id: string) => {
        setDenuncias((prev) => {
            const updated = prev.filter(d => d.id !== id)

            // Update saved user denuncias
            localStorage.setItem("denuncias", JSON.stringify(updated.filter(d => !mockDenuncias.some(m => m.id === d.id))))

            // Track deleted IDs (persisting deletions of mock data)
            const currentDeleted = localStorage.getItem("deleted_denuncias")
            const deletedIds = currentDeleted ? JSON.parse(currentDeleted) : []
            if (!deletedIds.includes(id)) {
                const newDeleted = [...deletedIds, id]
                localStorage.setItem("deleted_denuncias", JSON.stringify(newDeleted))
            }

            return updated
        })
    }

    const getDenunciaById = (id: string) => {
        return denuncias.find(d => d.id === id)
    }

    return (
        <DataContext.Provider
            value={{
                denuncias,
                addDenuncia,
                removeDenuncia,
                getDenunciaById
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
    const context = useContext(DataContext)
    if (context === undefined) {
        throw new Error("useData debe ser usado dentro de un DataProvider")
    }
    return context
}
