import { Category } from "../model/Category";

interface ICreateCategoryDTO {
  name: string;
  description: string;
}

// SUBSTITUIÇÃO DE LISKOV = contrato para utilização de interfaces
interface ICategoriesRepository {
  findByName(name: string): Category;
  list(): Category[];
  create({ name, description }: ICreateCategoryDTO): void;
}

export { ICategoriesRepository, ICreateCategoryDTO };
