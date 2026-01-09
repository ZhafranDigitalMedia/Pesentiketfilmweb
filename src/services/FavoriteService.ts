import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { Favorite } from "../models/Favorite";

export class FavoriteService {
  static subscribeByUser(
    userId: string,
    callback: (favorites: Favorite[]) => void
  ) {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", userId)
    );

    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(
        (doc) =>
          new Favorite(
            doc.id,
            doc.data().filmTitle,
            doc.data().genre,
            doc.data().year
          )
      );
      callback(data);
    });
  }

  static async deleteFavorite(id: string) {
    await deleteDoc(doc(db, "favorites", id));
  }
}
