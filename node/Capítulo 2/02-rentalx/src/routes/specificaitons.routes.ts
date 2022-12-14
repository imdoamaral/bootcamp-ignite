import { Router } from "express";

import { SpecificationRepository } from "../modules/cars/repositories/SpecificationsRepository";
import { CreateSpecificationService } from "../modules/cars/services/CreateSpecificationService";

const specificationsRoutes = Router();

const specificationsRepository = new SpecificationRepository();

specificationsRoutes.post("/", (request, response) => {
  const { name, description } = request.body;

  const createSpeficitaionService = new CreateSpecificationService(
    specificationsRepository
  );

  createSpeficitaionService.execute({ name, description });

  return response.status(201).send();
});

export { specificationsRoutes };
