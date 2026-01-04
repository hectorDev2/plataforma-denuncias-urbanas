import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Usuario, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { correo: email },
    });
  }

  async findById(id: number): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.UsuarioCreateInput): Promise<Usuario> {
    const salt = await bcrypt.genSalt();
    const contrasena = (data as any).contrasena ?? (data as any).password;
    const hashedPassword = await bcrypt.hash(contrasena, salt);
    const payload: any = { ...data, contrasena: hashedPassword };
    // remove legacy password if present
    delete payload.password;
    return this.prisma.usuario.create({ data: payload });
  }
}
