import { HttpException } from '@nestjs/common';

export function validateParkingPeriod(
  entryTime: Date,
  exitTime?: Date | null,
): void {
  if (entryTime && exitTime && exitTime < entryTime) {
    throw new HttpException(
      'A data e hora de saída não pode ser menor que a data e hora de entrada',
      412,
    );
  }
}
