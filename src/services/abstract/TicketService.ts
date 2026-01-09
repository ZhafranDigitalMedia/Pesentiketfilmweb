import { Ticket } from "../../models/Ticket";

export abstract class TicketService {
  abstract book(ticket: Ticket): Promise<void>;
  abstract getBookedSeats(
    cinemaId: string,
    schedule: string,
    filmTitle: string
  ): Promise<string[]>;
}
