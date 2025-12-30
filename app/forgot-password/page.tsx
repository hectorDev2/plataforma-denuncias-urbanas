"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { forgotPassword } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email) return setError("Ingresa tu correo");
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setMessage(
        "Si el correo es válido, recibirás instrucciones para restablecer tu contraseña."
      );
      setIsLoading(false);
      setTimeout(() => router.push("/login"), 4000);
    } catch (err: any) {
      setError(err.message || "Error al solicitar reseteo");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card className="bg-white/60 backdrop-blur-md border-white/40 shadow-sm">
          <CardHeader>
            <CardTitle>Recuperar Contraseña</CardTitle>
            <CardDescription>
              Ingresa tu correo y te enviaremos un enlace para restablecerla.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative mt-2">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar"}
                </Button>
                <Button variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
