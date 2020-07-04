import AppError from '../errors/AppError';
import { getCustomRepository, getRepository, ObjectID } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository'
import Transaction from '../models/Transaction'
import Category from '../models/Category'
import { isUuid } from 'uuidv4';

interface Request {
  id: string
};

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<Transaction> {
    if (!isUuid(id)) {
      throw new AppError("Invalid UIID");
    }

    const repository = getCustomRepository(TransactionsRepository);
    const transaction = await repository.findOne(id);

    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    await repository.remove(transaction);

    return transaction;
  }
}

export default DeleteTransactionService;
