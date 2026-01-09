import { FirebaseCinemaService } from "../services/FirebaseCinemaService";
import { Cinema } from "../models/Cinema";

export class CinemaController {
  private static service = new FirebaseCinemaService();

  static async getCinemas(): Promise<Cinema[]> {
    return this.service.getAll();
  }
}
