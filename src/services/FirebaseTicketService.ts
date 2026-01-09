import { TicketService } from "./abstract/TicketService";
import { Ticket } from "../models/Ticket";
import { db } from "../utils/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

export class FirebaseTicketService extends TicketService {
  async book(ticket: Ticket): Promise<void> {
    await addDoc(collection(db, "tickets"), {
      userId: ticket.getUserId(),
      cinemaId: ticket.getCinemaId(),
      cinemaName: ticket.getCinemaName(),
      filmTitle: ticket.getFilmTitle(),
      schedule: ticket.getSchedule(),
      seat: ticket.getSeat(),
      price: ticket.getPrice(),
      orderDate: Timestamp.now(),
    });
  }

  async getBookedSeats(
    cinemaId: string,
    schedule: string,
    filmTitle: string
  ): Promise<string[]> {
    const q = query(
      collection(db, "tickets"),
      where("cinemaId", "==", cinemaId),
      where("schedule", "==", schedule),
      where("filmTitle", "==", filmTitle)
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data().seat as string);
  }
}
