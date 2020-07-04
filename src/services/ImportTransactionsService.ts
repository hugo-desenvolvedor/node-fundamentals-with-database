import Transaction from '../models/Transaction';
import Category from '../models/Category';
import csvParse from 'csv-parse';
import fs from 'fs';
import { getRepository, In, getCustomRepository } from 'typeorm';
import e from 'express';
import TransactionsRepository from '../repositories/TransactionsRepository';


interface CSVTransaction {
  title: string,
  type: 'income' | 'outcome',
  value: number,
  category: string
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const csvFilePath = filePath;
    const readCSVStream = fs.createReadStream(csvFilePath);
    const parseStream = csvParse({
      delimiter: ',',
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });
    const parseCSV = readCSVStream.pipe(parseStream)

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const title = line[0],
        type = line[1],
        value = line[2],
        category = line[3];

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const categoriesRepository = getRepository(Category);
    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories)
      }
    });

    const existentCategoriesTitles = existentCategories.map((category: Category) => category.title);

    const addCategoryTitle = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitle.map(title => ({
        title
      }))
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [
      ...existentCategories,
      ...newCategories
    ];

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category
        )
      }))
    );

    await transactionsRepository.save(createdTransactions);
      
    await fs.promises.unlink(filePath); 

    return createdTransactions;
  }
}

export default ImportTransactionsService;
