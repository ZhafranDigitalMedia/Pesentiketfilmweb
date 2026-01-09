export class Cinema {
  constructor(
    private id: string,
    private name: string,
    private price: number,
    private location: string
  ) {}

  getId() { return this.id; }
  getName() { return this.name; }
  getPrice() { return this.price; }
  getLocation() { return this.location; }
}
