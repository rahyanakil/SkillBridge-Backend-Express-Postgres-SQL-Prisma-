// src/app/modules/course/course.service.ts

import { prisma } from "../../lib/prisma";

const createCourse = async (userId: string, payload: any) => {
  const tutorProfile = await prisma.tutor.findUnique({
    where: { userId: userId },
  });

  if (!tutorProfile) {
    throw new Error("Tutor profile not found for this user!");
  }

  return await prisma.course.create({
    data: {
      ...payload,
      tutorId: tutorProfile.id,
    },
  });
};

const getCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      tutor: { include: { user: true } },
      category: true,
    },
  });
  if (!course) throw new Error("Course not found");
  return course;
};

const getAllCourses = async (filter?: any) => {
  const where: any = {};
  if (filter?.tutorId) where.tutorId = filter.tutorId;
  if (filter?.categoryId) where.categoryId = filter.categoryId;

  return await prisma.course.findMany({
    where,
    include: {
      tutor: { include: { user: true } },
      category: true,
    },
  });
};

const updateCourse = async (id: string, userId: string, payload: any) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new Error("Course not found");

  const tutorProfile = await prisma.tutor.findUnique({
    where: { userId: userId },
  });

  if (!tutorProfile || course.tutorId !== tutorProfile.id) {
    throw new Error("You are not authorized to update this course!");
  }

  return await prisma.course.update({
    where: { id },
    data: payload,
  });
};

const deleteCourse = async (id: string, userId: string) => {
  try {
    const tutorProfile = await prisma.tutor.findUnique({
      where: { userId: userId },
    });

    if (!tutorProfile) throw new Error("Tutor profile not found!");

    const course = await prisma.course.findUnique({ where: { id } });

    if (!course) throw new Error("Course not found");

    if (course.tutorId !== tutorProfile.id) {
      throw new Error("You are not authorized to delete this course!");
    }

    await prisma.course.delete({ where: { id } });
    return true;
  } catch (error) {
    throw error;
  }
};

export const CourseService = {
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourse,
  deleteCourse,
};
