import {
  createCenter,
  deactivateCenter,
  findAllCenters,
  findCenterById,
  updateCenter,
} from "../repositories/center.repository";

import type {
  CreateCenterInput,
  UpdateCenterInput,
} from "../validators/center.validator";

export const createCenterService = async (
  input: CreateCenterInput
) => {
  return createCenter(input);
};

export const getAllCentersService = async () => {
  return findAllCenters();
};

export const getCenterByIdService = async (
  id: number
) => {
  return findCenterById(id);
};

export const updateCenterService = async (
  id: number,
  input: UpdateCenterInput
) => {
  return updateCenter(id, input);
};

export const deleteCenterService = async (
  id: number
) => {
  return deactivateCenter(id);
};