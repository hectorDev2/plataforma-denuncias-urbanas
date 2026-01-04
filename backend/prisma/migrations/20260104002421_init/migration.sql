/*
  Warnings:

  - You are about to drop the column `address` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `categoria` to the `Complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descripcion` to the `Complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `Complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contrasena` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correo` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contenido" TEXT NOT NULL,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remitenteId" INTEGER NOT NULL,
    "receptorId" INTEGER NOT NULL,
    CONSTRAINT "Message_remitenteId_fkey" FOREIGN KEY ("remitenteId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Notification_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "expiraEn" DATETIME NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "PasswordResetToken_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Complaint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pending',
    "latitud" REAL,
    "longitud" REAL,
    "direccion" TEXT,
    "urlImagen" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Complaint_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Complaint" ("id") SELECT "id" FROM "Complaint";
DROP TABLE "Complaint";
ALTER TABLE "new_Complaint" RENAME TO "Complaint";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "correo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'citizen',
    "estado" TEXT NOT NULL DEFAULT 'active',
    "avatar" TEXT
);
INSERT INTO "new_User" ("avatar", "id") SELECT "avatar", "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_correo_key" ON "User"("correo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");
