import Category from '../models/Category';
import { getRepository } from 'typeorm';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const repository = getRepository(Category);

    const checkCategoryExists = await repository.findOne({
      where: { title }
    })

    if (checkCategoryExists) {
      return checkCategoryExists;
    }

    const category = repository.create({ title });

    await repository.save(category);

    return category;
  }
}

export default CreateCategoryService;
