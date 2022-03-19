import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

export async function bootstrap(port: number) {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.use(helmet());
    const server = await app.listen(port || 4600);
    return { app, server };
}
bootstrap(4500);
