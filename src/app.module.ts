import { Module, MiddlewareConsumer } from '@nestjs/common';
import LogsMiddleware from './utils/logs.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LogsMiddleware).forRoutes('*');
    }
}
