import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDenunciaDto } from './dto/create-denuncia.dto';

@Injectable()
export class DenunciasService {
  constructor(private prisma: PrismaService) { }

  create(
    createDenunciaDto: CreateDenunciaDto,
    usuarioId: number,
    urlImagen?: string,
  ) {
    // Mapear campos del DTO a los campos de Prisma
    const data: any = {
      titulo: (createDenunciaDto as any).titulo ?? (createDenunciaDto as any).title,
      descripcion: (createDenunciaDto as any).descripcion ?? (createDenunciaDto as any).description,
      categoria: (createDenunciaDto as any).categoria ?? (createDenunciaDto as any).category,
      latitud: (createDenunciaDto as any).latitud ?? (createDenunciaDto as any).lat,
      longitud: (createDenunciaDto as any).longitud ?? (createDenunciaDto as any).lng,
      direccion: (createDenunciaDto as any).direccion ?? (createDenunciaDto as any).address,
      urlImagen,
      usuarioId,
    };
    return this.prisma.complaint.create({ data });
  }
  async findByUser(userId: number): Promise<any[]> {
    return this.prisma.complaint.findMany({ where: { usuarioId: userId } });
  }

  findAll(filters?: { estado?: string; categoria?: string }) {
    const where: any = {};
    if (filters?.estado) where.estado = filters.estado;
    if (filters?.categoria) where.categoria = filters.categoria;

    return this.prisma.complaint.findMany({
      where,
      orderBy: { creadoEn: 'desc' },
      include: { usuario: { select: { nombre: true, correo: true } } },
    });
  }

  findOne(id: number) {
    return this.prisma.complaint.findUnique({
      where: { id },
      include: { usuario: { select: { nombre: true, correo: true } } },
    });
  }

  updateStatus(id: number, estado: string) {
    return this.prisma.complaint.update({
      where: { id },
      data: { estado },
    });
  }

  remove(id: number) {
    return this.prisma.complaint.delete({
      where: { id },
    });
  }

  async getStats() {
    const total = await this.prisma.complaint.count();
    const byStatus = await this.prisma.complaint.groupBy({
      by: ['estado'],
      _count: { estado: true },
    });
    const byCategory = await this.prisma.complaint.groupBy({
      by: ['categoria'],
      _count: { categoria: true },
    });

    return {
      total,
      byStatus: byStatus.reduce(
        (acc, curr) => ({ ...acc, [curr.estado]: curr._count.estado }),
        {},
      ),
      byCategory: byCategory.reduce(
        (acc, curr) => ({ ...acc, [curr.categoria]: curr._count.categoria }),
        {},
      ),
    };
  }
}
