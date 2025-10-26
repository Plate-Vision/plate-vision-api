import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { Module } from '@nestjs/common';
import { join } from 'path';

import { EnvironmentVariablesModule } from '@core/enviroment-variables/enviroment-variables.module';
import { DatabaseModule } from '@core/database/database.module';
import { MetricsModule } from '@core/metrics/metrics.module';

import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { RoleModule } from '@modules/role/role.module';
import { VehicleModule } from '@modules/vehicle/vehicle.module';
import { CustomerModule } from '@modules/customer/customer.module';
import { ParkingRecordModule } from '@modules/parking-record/parking-record.module';
import { PlateReadingModule } from '@modules/plate-reading/plate-reading.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OccurrenceModule } from '@modules/occurrence/occurrence.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/api/public',
    }),
    ScheduleModule.forRoot(),
    MulterModule.register({}),
    EnvironmentVariablesModule,
    DatabaseModule,
    MetricsModule,
    AuthModule,
    UserModule,
    RoleModule,
    VehicleModule,
    CustomerModule,
    PlateReadingModule,
    ParkingRecordModule,
    OccurrenceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
