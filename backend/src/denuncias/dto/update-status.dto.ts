import { IsIn, IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsIn(['Pending', 'In Progress', 'Resolved'])
  status: string;
}
