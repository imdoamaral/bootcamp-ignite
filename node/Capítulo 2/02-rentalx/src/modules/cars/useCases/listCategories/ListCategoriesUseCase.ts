import { Category } from "../../model/Category";
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

class ListCategoriesUseCase {
  private categoriesRepository: ICategoriesRepository;

  // INVERSÃO DE DEPENDÊNCIA = recebe o repositório de dentro do construtor
  constructor(categoriesRepository: ICategoriesRepository) {
    this.categoriesRepository = categoriesRepository;
  }

  execute(): Category[] {
    const categories = this.categoriesRepository.list();

    return categories;
  }
}

export { ListCategoriesUseCase };
