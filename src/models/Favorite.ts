export class Favorite {
  constructor(
    private id: string,
    private filmTitle: string,
    private genre: string,
    private year: number
  ) {}

  getId() {
    return this.id;
  }

  getFilmTitle() {
    return this.filmTitle;
  }

  getGenre() {
    return this.genre;
  }

  getYear() {
    return this.year;
  }
}
