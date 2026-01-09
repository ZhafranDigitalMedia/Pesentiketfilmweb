export class Movie {
  constructor(
    private title: string,
    private price: number
  ) {}

  getTitle(): string {
    return this.title;
  }

  getPrice(): number {
    return this.price;
  }
}
