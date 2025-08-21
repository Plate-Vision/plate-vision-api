import { ApiProperty } from '@nestjs/swagger';

export class MessagePayload {
  @ApiProperty({
    description:
      'Mensagem de confirmação avisando que o processo ocorreu como o esperado',
  })
  public message: string;
}
