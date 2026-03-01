import { prisma } from "../../lib/prisma";

const createOrUpdateProfile = async (userId: string, payload: any) => {
  if (!userId) {
    throw new Error("User ID NOT EXISTS!");
  }
  const tutorData = {
    bio: payload.bio,
    expertise: payload.expertise,
    hourlyRate: payload.hourlyRate,
    experience: payload.experience,
  };
  const existingProfile = await prisma.tutor.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    const updated = await prisma.tutor.update({
      where: { userId },
      data: tutorData,
    });
    return updated;
  }
  const created = await prisma.tutor.create({
    data: {
      userId,
      ...tutorData,
    },
  });
  return created;
};

const getProfileByUserId = async (userId: string) => {
  const profile = await prisma.tutor.findUnique({
    where: { userId },
    include: {
      user: true,
      courses: true,
      bookings: true,
      reviews: true,
    },
  });
  if (!profile) {
    throw new Error("Tutor profile not fond");
  }
  return profile;
};

const getAllTutors = async () => {
  return await prisma.tutor.findMany({
    include: {
      user: true,
      courses: true,
      reviews: true,
    },
  });
};

export const TutorService = {
  createOrUpdateProfile,
  getProfileByUserId,
  getAllTutors,
};
