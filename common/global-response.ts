import { ApiProperty } from '@nestjs/swagger';

export class GlobalResponse {
  @ApiProperty({
    example: true,
    description: 'Success.',
    required: true,
  })
  success: boolean;

  @ApiProperty({
    example: 'OK',
    description: 'Message.',
    required: true,
  })
  message: string;

  @ApiProperty({
    example: [],
    description: 'data.',
    required: false,
  })
  data?: string[] | number[] | object[] | string | number | object;
}
