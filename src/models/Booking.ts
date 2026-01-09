import { User } from "./User";
import { Movie } from "./Movie";

export class Booking {
  constructor(
    private user: User,
    private movie: Movie
  ) {}

  getUser(): User {
    return this.user;
  }

  getMovie(): Movie {
    return this.movie;
  }

  getBasePrice(): number {
    return this.movie.getPrice();
  }
}
