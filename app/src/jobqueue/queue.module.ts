import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { createWorkers } from '../workers/divan.main';
import { DivanJobQueue } from './queue/divan.queue';
import { NatsModule } from '../nats/nats.module';
import { JobCompletedPublisher } from '../nats/publishers/job-completed-publisher';

@Module({
  imports: [NatsModule],
  providers: [DivanJobQueue],
  exports: [DivanJobQueue],
})
export class QueueModule implements OnModuleInit {
  @Inject(JobCompletedPublisher) jobCompletedPublisher: JobCompletedPublisher;
  async onModuleInit() {
    await createWorkers(this.jobCompletedPublisher);
  }
}
