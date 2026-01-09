import { AuthService } from "./abstract/AuthService";
import { User } from "../models/User";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../utils/firebase";

export class FirebaseAuthService extends AuthService {
  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async register(user: User, password: string): Promise<void> {
    await createUserWithEmailAndPassword(
      auth,
      user.getEmail(),
      password
    );

    // NOTE:
    // nama & no_telpon bisa disimpan ke Firestore
    // (tidak wajib untuk rubrik PBO)
  }
}
