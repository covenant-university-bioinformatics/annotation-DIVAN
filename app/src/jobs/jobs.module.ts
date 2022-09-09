import { Global, Module } from '@nestjs/common';
import { JobsDivanService } from './services/jobs.divan.service';
import { JobsDivanController } from './controllers/jobs.divan.controller';
import { QueueModule } from '../jobqueue/queue.module';
import { JobsDivanNoauthController } from './controllers/jobs.divan.noauth.controller';

@Global()
@Module({
  imports: [QueueModule],
  controllers: [JobsDivanController, JobsDivanNoauthController],
  providers: [JobsDivanService],
  exports: [],
})
export class JobsModule {}
