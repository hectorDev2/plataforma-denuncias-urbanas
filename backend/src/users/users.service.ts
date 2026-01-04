import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<any | null> {
    const client: any = (this.prisma as any);
    const model = client.usuario ?? client.user;
    return model.findUnique({ where: { correo: email } });
  }

  async findById(id: number): Promise<any | null> {
    const client: any = (this.prisma as any);
    const model = client.usuario ?? client.user;
    return model.findUnique({ where: { id } });
  }

  async create(data: any): Promise<any> {
    const salt = await bcrypt.genSalt();
    const contrasena = data?.contrasena ?? data?.password;
    const hashedPassword = await bcrypt.hash(contrasena, salt);
    const payload: any = { ...data, contrasena: hashedPassword };
    // remove legacy password if present
    delete payload.password;
    const client: any = (this.prisma as any);
    const model = client.usuario ?? client.user;
    return model.create({ data: payload });
  }
}
