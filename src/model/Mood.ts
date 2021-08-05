export class Mood {
  mood?: String;
  date?: Date;
  note?: String;
  id?: String;
  idCreator?: String;

  constructor(
    mood?: String,
    date?: Date,
    note?: String,
    id?: String,
    idCreator?: String
  ) {
    this.date = date;
    this.mood = mood;
    this.note = note;
    this.id = id;
    this.idCreator = idCreator;
  }

  public isMoodValid(): boolean {
    return this.mood !== undefined && this.idCreator !== undefined;
  }

  static toMood(json: any): Mood {
    return new Mood(
      json.mood,
      new Date(json.date),
      json.note,
      json.id,
      json.idCreator
    );
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
