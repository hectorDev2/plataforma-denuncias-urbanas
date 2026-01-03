import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDenunciaDto } from './dto/create-denuncia.dto';

@Injectable()
export class DenunciasService {
  constructor(private prisma: PrismaService) { }

  create(
    createDenunciaDto: CreateDenunciaDto,
    userId: number,
    imageUrl?: string,
  ) {
    return this.prisma.complaint.create({
      data: {
        ...createDenunciaDto,
        userId,
        imageUrl,
      },
    });
  }
  async findByUser(userId: number): Promise<any[]> {
    return this.prisma.complaint.findMany({ where: { userId } });
  }

  findAll(filters?: { status?: string; category?: string }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.category) where.category = filters.category;

    return this.prisma.complaint.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });
  }

  findOne(id: number) {
    return this.prisma.complaint.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });
  }

  updateStatus(id: number, status: string) {
    return this.prisma.complaint.update({
      where: { id },
      data: { status },
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
      by: ['status'],
      _count: { status: true },
    });
    const byCategory = await this.prisma.complaint.groupBy({
      by: ['category'],
      _count: { category: true },
    });

    return {
      total,
      byStatus: byStatus.reduce(
        (acc, curr) => ({ ...acc, [curr.status]: curr._count.status }),
        {},
      ),
      byCategory: byCategory.reduce(
        (acc, curr) => ({ ...acc, [curr.category]: curr._count.category }),
        {},
      ),
    };
  }
}
