export class Ticket {
  constructor(
    private userId: string,
    private cinemaId: string,
    private cinemaName: string,
    private filmTitle: string,
    private schedule: string,
    private seat: string,
    private price: number
  ) {}

  getUserId() { return this.userId; }
  getCinemaId() { return this.cinemaId; }
  getCinemaName() { return this.cinemaName; }
  getFilmTitle() { return this.filmTitle; }
  getSchedule() { return this.schedule; }
  getSeat() { return this.seat; }
  getPrice() { return this.price; }
}
