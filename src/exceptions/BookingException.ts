export class BookingException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingException";
  }
}
