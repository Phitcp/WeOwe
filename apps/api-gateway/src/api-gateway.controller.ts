import { Controller, Get, Inject, Injectable, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiGatewayService } from './api-gateway.service';

// Base class for ApiGateway controller to host shared dependencies.
// Child classes can extend this to avoid repeating constructor params.
@Injectable()
export class ApiGatewayControllerBaseDependencies {
  constructor(
    protected readonly apiGatewayService: ApiGatewayService,
  ) {}
}

@Controller('/api/v1/health-check')
export class ApiGatewayController extends ApiGatewayControllerBaseDependencies {
  @Get('/gateway')
  getHealthCheck() {
    return this.apiGatewayService.gateWayHealthCheck();
  }

  @Get('/service/:serviceName')
  checkWeOweHealth(
    @Param('serviceName') serviceName: string,
  ): Observable<{ status: number }> {
    return this.apiGatewayService.checkWeOweHealth(serviceName);
  }
}
