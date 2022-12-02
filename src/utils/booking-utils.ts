import enrollmentRepository from "@/repositories/enrollment-repository";
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

const bookingUtils = {
  checkEnrollmentAndTicket,
};

export default bookingUtils;
