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

  addDaysToDate(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  convertTimerToMs(time: string | number): number {
    if (typeof time === 'number') {
      return time;
    }

    const match = time.match(/^(\d+)([mhd])$/);
    if (!match) {
      throw new Error(
        `Invalid expiration format: ${time}. Use formats like '15m', '7d', etc.`,
      );
    }

    const [, value, unit] = match;
    const num = parseInt(value, 10);

    switch (unit) {
      case 'm':
        return num * 60 * 1000; // minutes to ms
      case 'h':
        return num * 60 * 60 * 1000; // hours to ms
      case 'd':
        return num * 24 * 60 * 60 * 1000; // days to ms
      default:
        throw new Error(
          `Unsupported time unit: ${unit}. Use 'm' for minutes, 'h' for hours, or 'd' for days.`,
        );
    }
  }
}
