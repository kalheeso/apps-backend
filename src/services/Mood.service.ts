import { firestore } from "firebase-admin";
import { HttpUtil } from "../util/HttpUtil";
import { Response, Request } from "express";
import { Mood } from "../model/Mood";
import { _onRequestWithOptions } from "firebase-functions/lib/providers/https";

export class MoodService {
  private db: firestore.Firestore;

  constructor(db: firestore.Firestore) {
    this.db = db;
  }

  public postEditMood(request: Request, response: Response) {
    if (request.body === undefined) {
      request.body = {};
    }
    let mood = Mood.toMood(request.body);
    if (mood.isMoodValid()) {
      if (
        mood.id === undefined ||
        mood.id === null ||
        mood.id === "null" ||
        mood.idCreator === undefined ||
        mood.idCreator === null ||
        mood.idCreator === "null"
      ) {
        mood.id = this.db.collection("x").doc().id;
        mood.date = new Date();
      } else {
        delete mood.date;
        mood.date = new Date();
      }
      this.db
        .doc(`moodsMatheus/${mood.id}`)
        .set(mood.toJson(), { merge: true })
        .then((moodSnap) => {
          HttpUtil.sucesso(mood.toJson(), response);
        })
        .catch((e) => {
          HttpUtil.falha("There's been an error " + e, response);
        });
    } else {
      HttpUtil.falha("Post or user are invalid", response);
    }
  }

  public deleteMood(request: Request, response: Response) {
    if (request.query.id === undefined || request.query.id === "") {
      HttpUtil.falha("Invalid mood", response);
    } else {
      this.db
        .doc(`moodsMatheus/${request.query.id}`)
        .delete()
        .then((moodSnap) => {
          HttpUtil.sucesso("Mood deleted", response);
        })
        .catch((erro) => {
          HttpUtil.falha("There's been an error", response);
        });
    }
  }

  public readSingleMood(request: Request, response: Response) {
    let id = request.query.id;
    this.db
      .collection("moodsMatheus")
      .doc(`${id}`)
      .get()
      .then((moodSnap) => {
        let mood: Mood = Mood.toMood(moodSnap.data());
        HttpUtil.sucesso(mood, response);
      })
      .catch((e) => {
        HttpUtil.falha("There's been an error " + e, response);
      });
  }

  public listMoods(request: Request, response: Response) {
    let idCreator = request.query.idCreator;
    this.db
      .collection("moodsMatheus")
      .orderBy("date", "desc")
      .where("idCreator", "==", idCreator)
      .get()
      .then((moodsSnap) => {
        let moodsList: Mood[] = [];
        moodsSnap.docs.forEach((moodSnap) => {
          moodsList.push(Mood.toMood(moodSnap.data()));
        });
        HttpUtil.sucesso(moodsList, response);
      })
      .catch((e) => {
        HttpUtil.falha("Unable to list your moods" + e, response);
      });
  }

  public listMoodsByDay(request: Request, response: Response) {
    let date = request.query.date;
    let idCreator = request.query.idCreator;
    this.db
      .collection("moodsMatheus")
      .where("idcreator", "==", idCreator)
      .orderBy("date", "desc")
      .startAfter(date)
      .endBefore(date)
      .get()
      .then((moodsSnap) => {
        let moodsList: Mood[] = [];
        moodsSnap.docs.forEach((moodSnap) => {
          moodsList.push(Mood.toMood(moodSnap.data()));
        });
        HttpUtil.sucesso(moodsList, response);
      })
      .catch((e) => {
        HttpUtil.falha("Unable to list your moods", response);
      });
  }
}
