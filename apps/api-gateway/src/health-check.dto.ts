import { Observable } from "rxjs";

export interface HealthClient {
  check(request: { service: string }): Observable<{ status: number }>;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptimeSeconds: number;
  cpuPercent: number;
  memoryPercent: number;
}