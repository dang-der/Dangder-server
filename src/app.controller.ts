import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // 단순 health check (on k8s ingress / vm instance lb) 를 위한 경로
  @Get('/')
  getHello() {
    return "hello, it's Dangder! :-0";
  }
}
