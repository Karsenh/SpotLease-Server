import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import { SortTypeEnum } from '@Enums/index';

export class GetPaginatedDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  perPage: number = 10;

  @ApiProperty({
    enum: SortTypeEnum,
    description: 'Order by',
  })
  @IsEnum(SortTypeEnum)
  @IsOptional()
  orderBy: SortTypeEnum = SortTypeEnum.DESC;
}
