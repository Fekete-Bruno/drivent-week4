import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function findBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    }
  });
}

async function countBookings(roomId: number) {
  return prisma.booking.count({
    where: {
      roomId
    }
  });
}

async function createBooking(bookingParams: CreateBookingParams) {
  return prisma.booking.create({
    data: {
      ...bookingParams
    }
  });
}

export type CreateBookingParams = Omit<Booking, "id" | "createdAt" | "updatedAt">
const bookingRepository = {
  findBooking,
  countBookings,
  createBooking,
};

export default bookingRepository;
