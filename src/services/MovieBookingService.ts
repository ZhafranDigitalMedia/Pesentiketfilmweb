import { BookingService } from "./abstract/BookingService";

export class MovieBookingService extends BookingService {
  calculatePrice(basePrice: number): number {
    return basePrice + BookingService.getPlatformFee();
  }
}
