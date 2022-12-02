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

async function updateBooking(updatedBooking: UpdateBookingParams, bookingId: number) {
  return prisma.booking.update({
    data: {
      ...updatedBooking
    },
    where: {
      id: bookingId
    }
  });
}

export type CreateBookingParams = Omit<Booking, "id" | "createdAt" | "updatedAt">
export type UpdateBookingParams = CreateBookingParams;
const bookingRepository = {
  findBooking,
  countBookings,
  createBooking,
  updateBooking,
};

export default bookingRepository;
