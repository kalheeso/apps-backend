import { Mood } from "./Mood";

export class User {
  moods?: Array<Mood>;
  id?: String;
  password?: String;
  name?: String;
  email?: String;

  constructor(
    moods?: Array<Mood>,
    id?: String,
    password?: String,
    name?: String,
    email?: String
  ) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.id = id;
    this.moods = moods;
  }

  public isUserValid(): boolean {
    return (
      this.email !== undefined &&
      this.email !== "" &&
      this.password !== undefined &&
      this.password !== "" &&
      this.name !== undefined &&
      this.name !== ""
    );
  }

  static toUser(json: any = {}): User {
    return new User(json.moods, json.id, json.password, json.name, json.email);
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
