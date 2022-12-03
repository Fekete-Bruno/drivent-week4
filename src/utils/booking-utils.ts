import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function checkEnrollmentAndTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  
  if(!enrollment) return false;
  
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  
  if(!ticket) return false;
    
  if(ticket.status==="RESERVED") return false;
    
  if(ticket.TicketType.isRemote===true) return false;
  
  if(ticket.TicketType.includesHotel===false) return false;
  
  return true;
}

async function checkRoom(roomId: number) {
  const room = await hotelRepository.findRoomById(roomId);
  if(!room) return 0;
  return room;
}

async function checkBookingCount(roomId: number, capacity: number) {
  const bookingCount = await bookingRepository.countBookings(roomId);
  if(bookingCount===capacity) return false;
  return true;
}

const bookingUtils = {
  checkEnrollmentAndTicket,
  checkRoom,
  checkBookingCount,
};

export default bookingUtils;
