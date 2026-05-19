import { UtilService } from '@app/util';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseAppServiceDependencies {
  constructor(protected readonly utilService: UtilService) {}
}

@Injectable()
export class AppService extends BaseAppServiceDependencies {
  check() {
    return {
      status: 'Ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Number(process.uptime().toFixed(2)),
      cpuPercent: this.utilService.getCpuPercent(),
      memoryPercent: this.utilService.getMemoryPercent(),
    };
  }
}
