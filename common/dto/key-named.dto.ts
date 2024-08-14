import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class KeyNamedDto {
  @ApiProperty({
    example: 'Lorem ipsum',
    description: 'Reason name',
    required: false,
    nullable: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'lorem-ipsum',
    description: 'Reason key name',
    required: false,
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  nameKey: string;
}
