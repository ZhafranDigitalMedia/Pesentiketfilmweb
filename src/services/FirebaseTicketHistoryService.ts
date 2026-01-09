import { db } from "../utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export class FirebaseTicketHistoryService {
  async getHistory(userId: string) {
    const q = query(
      collection(db, "tickets"),
      where("userId", "==", userId)
    );

    const snap = await getDocs(q);

    return snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        filmTitle: d.filmTitle,
        cinemaName: d.cinemaName,
        schedule: d.schedule,
        seat: d.seat,
        price: d.price,
      };
    });
  }
}
