import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { RentalModule } from './rental/rental.module';
import { RenterModule } from './renter/renter.module';
import { KnexModule } from 'nest-knexjs';

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'pg',
        connection: {
          host: 'localhost',
          user: 'postgres',
          password: 'postgres',
          database: 'biblioteca',
        },
      },
    }),
    AuthorModule,
    BookModule,
    RentalModule,
    RenterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
