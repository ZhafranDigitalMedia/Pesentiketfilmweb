import { FirebaseProfileService } from "../services/FirebaseProfileService";
import { UserProfile } from "../models/UserProfile";

export class ProfileController {
  private static service = new FirebaseProfileService();

  static async loadProfile(): Promise<UserProfile> {
    return await this.service.getProfile();
  }

  static async logout(): Promise<void> {
    await this.service.logout();
  }
}
