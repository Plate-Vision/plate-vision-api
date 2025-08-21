import {
  Controller,
  SerializeOptions,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AbilityGuard } from '@modules/auth/domain/guards/ability.guard';
import { AuthGuard } from '@modules/auth/domain/guards/auth.guard';
import { RoleGuard } from '@modules/auth/domain/guards/role.guard';

export abstract class ControllerDecorator {
  private route: string;
  private description: string;
  public constructor(route: string, description: string) {
    this.route = route;
    this.description = description;
  }

  protected applyProperties(
    ...properties: Array<ClassDecorator | MethodDecorator | PropertyDecorator>
  ) {
    const decorator = [this.controller()];
    if (properties && properties.length) {
      decorator.push(...properties);
    }
    return applyDecorators(...decorator);
  }

  protected applyPropertiesWithSuffix(
    suffix: string,
    ...properties: Array<ClassDecorator | MethodDecorator | PropertyDecorator>
  ) {
    const decorator = [this.controller(suffix)];
    if (properties && properties.length) {
      decorator.push(...properties);
    }
    return applyDecorators(...decorator);
  }

  private controller(suffix?: string) {
    const description = `${this.description} - ${this.route}`;
    const path = suffix ? `${this.route}/${suffix}` : this.route;
    return applyDecorators(Controller(path), ApiTags(description));
  }

  protected securityInformationEntities(securityOptions: string[]) {
    return applyDecorators(SerializeOptions({ groups: securityOptions }));
  }

  protected login() {
    return applyDecorators(
      UseGuards(AuthGuard, RoleGuard, AbilityGuard),
      ApiBearerAuth(),
    );
  }
}
