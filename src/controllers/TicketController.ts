import { Ticket } from "../models/Ticket";
import { FirebaseTicketService } from "../services/FirebaseTicketService";

export class TicketController {
  private static service = new FirebaseTicketService();

  static async book(ticket: Ticket): Promise<void> {
    await this.service.book(ticket);
  }

  static async getBookedSeats(
    cinemaId: string,
    schedule: string,
    filmTitle: string
  ): Promise<string[]> {
    return this.service.getBookedSeats(cinemaId, schedule, filmTitle);
  }
}
