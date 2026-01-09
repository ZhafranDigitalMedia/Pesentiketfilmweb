export abstract class BookingService {
  abstract calculatePrice(basePrice: number): number;

  static getPlatformFee(): number {
    return 5000;
  }
}
