import { Router } from 'express';
import { getRepository } from 'typeorm';

// import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

import CreateCategoryService from '../services/CreateCategoryService';
import Category from '../models/Category';


const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  // TODO
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createCategory = new CreateCategoryService();
  const categoryEntity = await createCategory.execute({ title: category });
  
  const createTransaction = new CreateTransactionService();
  const transactionEntity = await createTransaction.execute({ title, value, type, category_id: categoryEntity.id });

  delete transactionEntity.category_id;

  const result = {
    ...transactionEntity,
    category: categoryEntity
  }

  response.json(result);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
