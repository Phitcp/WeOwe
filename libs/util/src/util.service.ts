import { Injectable } from '@nestjs/common';
import * as os from 'os';

const toPercent = (value: number): number => Number(value.toFixed(1));

@Injectable()
export class UtilService {
  getCpuPercent(): number {
    const cpuUsage = process.cpuUsage();
    const uptimeSeconds = process.uptime();
    const cores = os.cpus().length;
    const totalCpuMs = (cpuUsage.user + cpuUsage.system) / 1000;
    const totalSystemMs = uptimeSeconds * cores * 1000;

    return totalSystemMs > 0
      ? toPercent((totalCpuMs / totalSystemMs) * 100)
      : 0;
  }

  getMemoryPercent(): number {
    const memory = process.memoryUsage();
    const totalSystemMemoryBytes = os.totalmem();

    return totalSystemMemoryBytes > 0
      ? toPercent((memory.rss / totalSystemMemoryBytes) * 100)
      : 0;
  }
}
