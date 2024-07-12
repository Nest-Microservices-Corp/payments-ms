import { Controller, Get } from '@nestjs/common';

@Controller('healt-check')
export class HealtCheckController {
  
  @Get()
  healtCheck() {
    return 'Client Gateway is up running!!!';
  }

}
