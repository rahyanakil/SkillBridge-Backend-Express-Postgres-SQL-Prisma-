import { prisma } from "../../lib/prisma";

const createCategory = async (payload: any) => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};
const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    include: {
      courses: true,
    },
  });

  return result;
};

const updateCategory = async (id: string, payload: any) => {
  const result = await prisma.category.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteCategory = async (id: string) => {
  const result = await prisma.category.delete({
    where: {
      id,
    },
  });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
