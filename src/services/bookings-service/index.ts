import { forbiddenError, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import hotelRepository from "@/repositories/hotel-repository";
import bookingUtils from "@/utils/booking-utils";

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);

  if(!booking) throw notFoundError();

  return ({
    id: booking.id,
    Room: booking.Room
  });
}

async function postBooking(userId: number, roomId: number) {
  if(roomId<1) {
    throw notFoundError();
  }
  if(isNaN(roomId)) {    
    throw forbiddenError();
  }

  if(!bookingUtils.checkEnrollmentAndTicket(userId)) throw forbiddenError();

  const roomCapacity = await bookingUtils.checkRoom(roomId);
  if(!roomCapacity) throw notFoundError();

  if(!bookingUtils.checkBookingCount(roomId, roomCapacity)) throw forbiddenError();

  const bookingExists = await bookingRepository.findBooking(userId);
  if(bookingExists) throw forbiddenError();

  const createdBooking = await bookingRepository.createBooking({ userId, roomId });
  return {
    bookingId: createdBooking.id
  };
}

async function editBooking(userId: number, roomId: number, bookingId: number) {
  if(roomId<1) {
    throw notFoundError();
  }
  if(isNaN(roomId)) {    
    throw forbiddenError();
  }

  if(bookingId<1) {
    throw forbiddenError();
  }
  if(isNaN(bookingId)) {    
    throw forbiddenError();
  }

  if(!bookingUtils.checkEnrollmentAndTicket(userId)) throw forbiddenError();

  const booking = await bookingRepository.findBooking(userId);
  if(!booking) throw forbiddenError();
  if(booking.id!==bookingId) throw forbiddenError();

  const roomCapacity = await bookingUtils.checkRoom(roomId);
  if(!roomCapacity) throw notFoundError();

  if(!bookingUtils.checkBookingCount(roomId, roomCapacity)) throw forbiddenError();
  
  const newBooking = await bookingRepository.updateBooking({ userId, roomId }, bookingId);
  return {
    bookingId: newBooking.id
  };
}

const bookingService = {
  getBooking,
  postBooking,
  editBooking
};

export default bookingService;
