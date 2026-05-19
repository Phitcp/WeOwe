import { Controller, Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

// base dependency container for AppController
@Injectable()
export class AppControllerBaseDependencies {
  constructor(protected readonly appService: AppService) {}
}

@Controller()
export class AppController extends AppControllerBaseDependencies {
  // no constructor needed — dependencies injected via AppControllerBase

  @GrpcMethod('Health', 'Check')
  check() {
    return this.appService.check();
  }
}
