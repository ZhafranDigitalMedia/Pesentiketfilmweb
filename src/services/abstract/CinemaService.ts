import { Cinema } from "../../models/Cinema";

export abstract class CinemaService {
  abstract getAll(): Promise<Cinema[]>;
}
