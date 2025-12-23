"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockDenuncias } from "@/data/mock-data"
import type { Denuncia } from "@/lib/types"

interface DataContextType {
    denuncias: Denuncia[]
    addDenuncia: (denuncia: Denuncia) => void
    getDenunciaById: (id: string) => Denuncia | undefined
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
    const [denuncias, setDenuncias] = useState<Denuncia[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from local storage on mount
    useEffect(() => {
        const storedDenuncias = localStorage.getItem("denuncias")
        if (storedDenuncias) {
            try {
                const parsed = JSON.parse(storedDenuncias)
                // Combine mock data with stored data, removing duplicates by ID just in case
                // We prioritize stored data if there are collisions/updates to mock data, 
                // but for simplicity, we'll just append new ones to the mock list if they aren't already there.
                // Actually, a simpler approach for this demo: 
                // If storage exists, use it. If not, use mock.
                // BUT, we want to keep the mock data "fresh" if it changes in code? 
                // Let's just merge: Mock Data + Stored Data (that isn't in mock data)

                // For simplicity in this demo:
                // We will initialize with mockDenuncias. 
                // Any persistence is for *new* items.
                // So we filter formatted stored items to ensure we don't duplicate if we accidentally stored mock items.

                const validStored = Array.isArray(parsed) ? parsed : []
                const combined = [...mockDenuncias, ...validStored.filter((d: Denuncia) => !mockDenuncias.some(m => m.id === d.id))]

                setDenuncias(combined)
            } catch (error) {
                console.error("Error parsing stored denuncias:", error)
                setDenuncias(mockDenuncias)
            }
        } else {
            setDenuncias(mockDenuncias)
        }
        setIsLoaded(true)
    }, [])

    const addDenuncia = (newDenuncia: Denuncia) => {
        setDenuncias((prev) => {
            const updated = [newDenuncia, ...prev]

            // Save ONLY the user-created ones to localStorage to avoid exceeding limits with static data
            // We identify user created ones as those NOT in original mockDenuncias
            // Or simply save everything. For a demo, saving everything is fine and easier.
            localStorage.setItem("denuncias", JSON.stringify(updated.filter(d => !mockDenuncias.some(m => m.id === d.id))))

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
