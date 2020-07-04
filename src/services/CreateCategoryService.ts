import Category from '../models/Category';
import { getRepository } from 'typeorm';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const repository = getRepository(Category);

    let category = await repository.findOne({
      where: { title }
    })

    if (!category) {
      category = repository.create({ title });
    }

    await repository.save(category);

    return category;
  }
}

export default CreateCategoryService;
