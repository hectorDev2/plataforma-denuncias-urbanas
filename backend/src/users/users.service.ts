import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { correo: email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const salt = await bcrypt.genSalt();
    const contrasena = (data as any).contrasena ?? (data as any).password;
    const hashedPassword = await bcrypt.hash(contrasena, salt);
    const payload: any = { ...data, contrasena: hashedPassword };
    // remove legacy password if present
    delete payload.password;
    return this.prisma.user.create({ data: payload });
  }
}
