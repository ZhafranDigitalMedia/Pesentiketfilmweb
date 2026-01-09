import { FavoriteService } from "../services/FavoriteService";
import { Favorite } from "../models/Favorite";

export class FavoriteController {
  static subscribe(
    userId: string,
    callback: (favorites: Favorite[]) => void
  ) {
    return FavoriteService.subscribeByUser(userId, callback);
  }

  static async remove(id: string) {
    await FavoriteService.deleteFavorite(id);
  }
}
