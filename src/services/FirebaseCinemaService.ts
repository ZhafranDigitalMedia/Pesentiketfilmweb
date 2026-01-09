import { CinemaService } from "./abstract/CinemaService";
import { Cinema } from "../models/Cinema";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export class FirebaseCinemaService extends CinemaService {
  async getAll(): Promise<Cinema[]> {
    const snap = await getDocs(collection(db, "cinemas"));

    return snap.docs.map(
      (doc) =>
        new Cinema(
          doc.id,
          doc.data().name,
          doc.data().price,
          doc.data().location
        )
    );
  }
}
