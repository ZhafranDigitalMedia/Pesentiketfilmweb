import { ProfileService } from "./abstract/ProfileService";
import { UserProfile } from "../models/UserProfile";
import { auth, db } from "../utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

export class FirebaseProfileService extends ProfileService {

  async getProfile(): Promise<UserProfile> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (!firebaseUser) {
          reject("NOT_AUTHENTICATED");
          return;
        }

        const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userSnap.data();

        const ticketSnap = await getDocs(
          query(collection(db, "tickets"), where("userId", "==", firebaseUser.uid))
        );

        const favSnap = await getDocs(
          query(collection(db, "favorites"), where("userId", "==", firebaseUser.uid))
        );

        resolve(
          new UserProfile(
            userData?.name,
            userData?.email,
            userData?.no_telp,
            userData?.role,
            ticketSnap.size,
            favSnap.size
          )
        );
      });
    });
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }
}
