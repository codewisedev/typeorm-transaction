import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";

/** The constructor injects a DataSource dependency.
 * runInTransaction method creates a query runner, starts a transaction,
 * executes a callback function with the query runner, commits the transaction if successful,
 * or rolls back and releases the query runner if an error occurs.*/

/**
 * Example for call TransactionService:
 * 
@Injectable()
export class ExampleService {
  constructor(private readonly transactionService: TransactionService) {}

  async CreateEntity() {
    return this.transactionService.runInTransaction(async (queryRunner) => {
      const newEntity = {
        key: value
      };
      await queryRunner.manager.insert(Entity, newEntity);

      throw new Error();
    });
  }
}
 */

@Injectable()
export class TransactionService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Executes the given callback function inside a transaction, handling the
   * transaction management and resource cleanup.
   *
   * @param {(queryRunner: QueryRunner) => Promise<any>} callback - The callback
   * function to be executed inside the transaction.
   * @return {Promise<any>} The result of the callback function execution.
   */
  async runInTransaction(
    callback: (queryRunner: QueryRunner) => Promise<any>
  ): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await callback(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
