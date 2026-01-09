import { UserProfile } from "../../models/UserProfile";

export abstract class ProfileService {
  abstract getProfile(): Promise<UserProfile>;
  abstract logout(): Promise<void>;
}
