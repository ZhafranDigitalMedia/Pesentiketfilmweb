import { User } from "../../models/User";

export abstract class AuthService {
  abstract login(email: string, password: string): Promise<void>;

  abstract register(
    user: User,
    password: string
  ): Promise<void>;
}
