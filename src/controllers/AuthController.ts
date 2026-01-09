import { FirebaseAuthService } from "../services/FirebaseAuthService";
import { AuthException } from "../exceptions/AuthException";
import { User } from "../models/User";

export class AuthController {
  private static authService = new FirebaseAuthService();

  static async login(email: string, password: string): Promise<void> {
    try {
      await this.authService.login(email, password);
    } catch {
      throw new AuthException("Login gagal");
    }
  }

  static async register(
    name: string,
    phone: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {

    // 🔒 VALIDASI DI CONTROLLER (BENAR)
    if (password !== confirmPassword) {
      throw new AuthException("Password dan konfirmasi tidak sama");
    }

    try {
      const user = new User(
        Date.now(), // dummy id
        name,
        phone,
        email
      );

      await this.authService.register(user, password);

    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        throw new AuthException("Email sudah terdaftar");
      }
      if (err.code === "auth/weak-password") {
        throw new AuthException("Password minimal 6 karakter");
      }
      throw new AuthException("Registrasi gagal");
    }
  }
}
