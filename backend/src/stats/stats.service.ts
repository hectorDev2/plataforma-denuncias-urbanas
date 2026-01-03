
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // 1️⃣ Total de denuncias
    const totalComplaints = await this.prisma.complaint.count();

    // 2️⃣ Denuncias por estado
    const statusGroups = await this.prisma.complaint.groupBy({
      by: ['estado'],
      _count: { estado: true },
    });
    
    // Normalize to ensure all statuses are present
    const statusMap = {
      pending: 0,
      in_progress: 0,
      resolved: 0,
    };
    statusGroups.forEach((g) => {
      if (g.estado in statusMap) {
        statusMap[g.estado] = g._count.estado;
      }
    });

    // 3️⃣ Denuncias por categoría
    const categoryGroups = await this.prisma.complaint.groupBy({
      by: ['categoria'],
      _count: { categoria: true },
    });

    const categoryStats = categoryGroups.map((g) => ({
      category: g.categoria,
      count: g._count.categoria,
    }));

    // 4️⃣ Denuncias por fecha (JS processing for Chart data)
    const complaints = await this.prisma.complaint.findMany({
      select: { creadoEn: true },
      orderBy: { creadoEn: 'asc' },
    });

    const dateStats = this.processDateStats(complaints);

    // 5️⃣ Usuarios registrados
    const totalUsers = await this.prisma.user.count();
    const activeUsers = await this.prisma.user.count({
      where: { estado: 'active' },
    });
    const blockedUsers = await this.prisma.user.count({
      where: { estado: 'blocked' },
    });

    return {
      complaints: {
        total: totalComplaints,
        byStatus: statusMap,
        byCategory: categoryStats,
        byDate: dateStats,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        blocked: blockedUsers,
      },
    };
  }

  private processDateStats(complaints: { creadoEn: Date }[]) {
    // Helpers
    const getWeekNumber = (d: Date) => {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      return `${d.getUTCFullYear()}-W${weekNo}`;
    };

    const byDay: Record<string, number> = {};
    const byWeek: Record<string, number> = {};
    const byMonth: Record<string, number> = {};

    complaints.forEach((c) => {
      const date = new Date(c.creadoEn);
      const dayKey = date.toISOString().split('T')[0];
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
      const weekKey = getWeekNumber(date);

      byDay[dayKey] = (byDay[dayKey] || 0) + 1;
      byWeek[weekKey] = (byWeek[weekKey] || 0) + 1;
      byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
    });

    // Transform to array formats for charts if needed, or keep objects
    // Let's return arrays sorted by key
    const toArray = (obj: Record<string, number>) => 
      Object.entries(obj)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, value]) => ({ date: key, count: value }));

    return {
      daily: toArray(byDay),
      weekly: toArray(byWeek),
      monthly: toArray(byMonth),
    };
  }
}
