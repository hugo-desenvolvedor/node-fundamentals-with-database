import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import TransactionsRepository from '../repositories/TransactionsRepository';

import uploadConfig from '../config/upload';
const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();

  const balance = await transactionsRepository.getBalance();

  response.json({
    transactions,
    balance
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();
  const transactions = await createTransaction.execute({ title, value, type, category });

  response.json(transactions);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  const transaction = await deleteTransactionService.execute({ id });

  response.json(transaction);
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const filePath = request.file.path;
    
    const importTransactions = new ImportTransactionsService();
    
    const transactions = await importTransactions.execute(filePath);

    response.json(transactions);
  }
);

export default transactionsRouter;
