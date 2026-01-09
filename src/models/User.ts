export class User {
  constructor(
    private id: number,
    private name: string,
    private phone: string,
    private email: string
  ) {}

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPhone(): string {
    return this.phone;
  }

  getEmail(): string {
    return this.email;
  }
}
