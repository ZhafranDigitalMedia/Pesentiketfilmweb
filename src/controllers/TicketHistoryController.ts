import { FirebaseTicketHistoryService } from "../services/FirebaseTicketHistoryService";

export class TicketHistoryController {
  private static service = new FirebaseTicketHistoryService();

  static async getHistory(userId: string) {
    return this.service.getHistory(userId);
  }
}
