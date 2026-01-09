export class UserProfile {
  constructor(
    private name: string,
    private email: string,
    private phone: string,
    private role: string,
    private totalTicket: number,
    private totalFavorite: number
  ) {}

  getName() { return this.name; }
  getEmail() { return this.email; }
  getPhone() { return this.phone; }
  getRole() { return this.role; }
  getTotalTicket() { return this.totalTicket; }
  getTotalFavorite() { return this.totalFavorite; }
}
