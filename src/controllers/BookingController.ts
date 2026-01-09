import { User } from "../models/User";
import { Movie } from "../models/Movie";
import { Booking } from "../models/Booking";
import { MovieBookingService } from "../services/MovieBookingService";
import { BookingException } from "../exceptions/BookingException";

export class BookingController {
  static createBooking(user: User, movie: Movie): number {
    if (!user || !movie) {
      throw new BookingException("User atau Movie tidak valid");
    }

    const booking = new Booking(user, movie);
    const service = new MovieBookingService();

    return service.calculatePrice(booking.getBasePrice());
  }
}
