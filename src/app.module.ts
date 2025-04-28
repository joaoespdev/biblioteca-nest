import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { RentalModule } from './rental/rental.module';
import { RenterModule } from './renter/renter.module';

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'pg',
        connection: {
          host: 'localhost',
          user: 'admin',
          password: '123',
          database: 'crud_biblioteca',
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
