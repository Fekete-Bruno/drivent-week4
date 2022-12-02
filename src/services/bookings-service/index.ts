import { forbiddenError, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import hotelRepository from "@/repositories/hotel-repository";
import bookingUtils from "@/utils/booking-utils";

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);
  if(!booking) {
    throw notFoundError();
  }

  return ({
    id: booking.id,
    Room: booking.Room
  });
}

async function postBooking(userId: number, roomId: number) {
  if(roomId<1) {
    throw forbiddenError();
  }

  if(!bookingUtils.checkEnrollmentAndTicket(userId)) throw forbiddenError();

  const room = await hotelRepository.findRoomById(roomId);
  if(!room) throw notFoundError();

  const bookingCount = await bookingRepository.countBookings(roomId);
  if(bookingCount===room.capacity) throw forbiddenError();

  const bookingExists = await bookingRepository.findBooking(userId);
  if(bookingExists) throw forbiddenError();

  const createdBooking = await bookingRepository.createBooking({ userId, roomId });
  return {
    bookingId: createdBooking.id
  };
}

const bookingService = {
  getBooking,
  postBooking,
};

export default bookingService;
