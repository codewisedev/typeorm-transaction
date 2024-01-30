import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...Config.dbConnection,
    }),
  ],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class DatabaseModule {}
