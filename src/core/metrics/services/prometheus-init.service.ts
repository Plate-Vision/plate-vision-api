import { Injectable, OnModuleInit } from '@nestjs/common';
import { Registry } from 'prom-client';

@Injectable()
export class PrometheusInitService implements OnModuleInit {
  public registry: Registry;
  public onModuleInit() {
    this.registry = new Registry();
  }
}
