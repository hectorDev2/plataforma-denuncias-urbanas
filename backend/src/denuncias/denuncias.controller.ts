/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UnauthorizedException,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { DenunciasService } from './denuncias.service';
import { CreateDenunciaDto } from './dto/create-denuncia.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('denuncias')
export class DenunciasController {
  constructor(private readonly denunciasService: DenunciasService) { }

  @Get()
  findAll(
    @Query('status') status: string,
    @Query('category') category: string,
  ) {
    return this.denunciasService.findAll({ status, category });
  }

  @Get('usuario/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.denunciasService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @Body() createDenunciaDto: CreateDenunciaDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.denunciasService.create(
      createDenunciaDto,
      req.user.userId,
      imageUrl,
    );
  }

  @Get('stats/dashboard')
  getStats() {
    return this.denunciasService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.denunciasService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
    @Request() req,
  ) {
    if (req.user.role !== 'authority') {
      throw new UnauthorizedException('Only authority can update status');
    }
    return this.denunciasService.updateStatus(id, updateStatusDto.status);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const denuncia = await this.denunciasService.findOne(id);
    if (!denuncia) {
      throw new ForbiddenException('Complaint not found');
    }

    // Check if user is the owner or an authority (optional, but good practice)
    if (denuncia.userId !== req.user.userId && req.user.role !== 'authority') {
      throw new ForbiddenException('You can only delete your own complaints');
    }

    return this.denunciasService.remove(id);
  }
}
