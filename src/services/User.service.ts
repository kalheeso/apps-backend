import { firestore } from "firebase-admin";
import { HttpUtil } from "../util/HttpUtil";
import { Response, Request } from "express";
import { User } from "../model/User";

export class UserService {
  private db: firestore.Firestore;

  constructor(db: firestore.Firestore) {
    this.db = db;
  }

  /**
   * registerUser
   */
  public registerUser(request: Request, response: Response) {
    let user: User = User.toUser(request.body);
    if (user.isUserValid()) {
      this.db
        .collection("usersMatheus")
        .where("email", "==", user.email)
        .get()
        .then((usersSnap) => {
          if (usersSnap.empty) {
            var id = this.db.collection("x").doc().id;
            user.id = id;
            return this.db.doc(`usersMatheus/${id}`).create(user.toJson());
          } else {
            HttpUtil.falha("The user already exists", response);
            return null;
          }
        })
        .then((responseRegisterUser) => {
          if (responseRegisterUser != null) {
            HttpUtil.sucesso(user.toJson(), response);
          }
        })
        .catch((e) => {
          HttpUtil.falha("There's been an error " + e, response);
        });
    } else {
      HttpUtil.falha("Invalid user", response);
    }
  }

  public loginUser(request: Request, response: Response) {
    let user: User = User.toUser(request.body);

    if (
      user.email === null ||
      user.email === "" ||
      user.password === null ||
      user.password === ""
    ) {
      HttpUtil.falha("User and password must be informed", response);
    } else {
      this.db
        .collection("usersMatheus")
        .where("email", "==", user.email)
        .where("password", "==", user.password)
        .get()
        .then((userSnap) => {
          if (userSnap.empty) {
            HttpUtil.falha("Wrong password or email", response);
          } else {
            let userReturn = User.toUser(userSnap.docs[0].data());
            HttpUtil.sucesso(userReturn.toJson(), response);
          }
        })
        .catch((e) => {
          HttpUtil.falha("Ops! Houve um erro " + e, response);
        });
    }
  }

  public editUser(request: Request, response: Response) {
    let user: User = User.toUser(request.body);
    if (user.isUserValid() && user.id !== undefined && user.id !== "") {
      this.db
        .doc(`usersMatheus/${user.id}`)
        .set(user.toJson())
        .then((resultadoSnap) => {
          HttpUtil.sucesso(user, response);
        })
        .catch((erro) => {
          HttpUtil.falha("There's been an error", response);
        });
    } else {
      HttpUtil.falha("Invalid user", response);
    }
  }
}
