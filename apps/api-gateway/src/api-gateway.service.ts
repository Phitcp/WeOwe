import { UtilService } from '@app/util';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as microservices from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { HealthCheckResponse, HealthClient } from './health-check.dto';

/**
 * Base dependency container for ApiGatewayService
 * Keeps constructor-injected dependencies centralized so child services
 * don't need to repeat constructor params.
 */
export class ApiGatewayServiceBase {
  constructor(
    @Inject('WE_OWE_SERVICE') protected readonly grpcClient: microservices.ClientGrpc,
    protected readonly utilService: UtilService,
  ) {}
}

@Injectable()
export class ApiGatewayService extends ApiGatewayServiceBase implements OnModuleInit {
  private healthService: HealthClient | null = null;

  onModuleInit() {
    this.healthService = this.grpcClient.getService<HealthClient>('Health');
  }

  gateWayHealthCheck(): HealthCheckResponse {
    return {
      status: 'Ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Number(process.uptime().toFixed(2)),
      cpuPercent: this.utilService.getCpuPercent(),
      memoryPercent: this.utilService.getMemoryPercent(),
    };
}
  checkWeOweHealth(serviceName: string): Observable<{ status: number }> {
    if (!this.healthService) {
      // defensive: fail fast if service not initialized
      throw new Error('Health service not initialized');
    }

    return this.healthService.check({ service: serviceName });
  }
}
