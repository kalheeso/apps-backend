import { firestore } from "firebase-admin";
import { Request, Response } from "express";
import { ManterUsuario } from "../model/ManterUsuario";
import { HttpUtil } from "../util/HttpUtil";

export class UsuarioService {
  private db: firestore.Firestore;

  constructor(database: firestore.Firestore) {
    this.db = database;
  }

  /**
   * O serviço cadastra o usuario, validando lse ele existe ou n
   */
  public cadastrarUsuario(request: Request, response: Response) {
    const usuario: ManterUsuario = ManterUsuario.toManterUsuario(request.body);
    if (usuario.isUsuarioValido()) {
      this.db
        .collection("usuariosmatheus")
        .where("email", "==", usuario.email)
        .get()
        .then((usuariosSnap) => {
          if (usuariosSnap.size == 0) {
            var id = this.db.collection("x").doc().id;
            usuario.id = id;
            return this.db
              .doc(`usuariosmatheus/${id}`)
              .create(usuario.toJson());
          } else {
            HttpUtil.falha("O usuário já existe", response);
            return null;
          }
        })
        .then((responseCriacaoUsuario) => {
          if (responseCriacaoUsuario != null) {
            HttpUtil.sucesso(usuario.toJson(), response);
          }
        })
        .catch((erro) => {
          HttpUtil.falha("Ops! Tive um erro " + erro, response);
        });
    } else {
      HttpUtil.falha("Usuário inválido! ", response);
    }
  }

  /**
   * logarUsuario
   */
  public logarUsuario(request: Request, response: Response) {
    var senha = request.query.senha;
    var email = request.query.email;

    if (email === null || email === "" || senha === null || senha === "") {
      HttpUtil.falha("Preencha o usuário e a senha", response);
    } else {
      this.db
        .collection("usuariosmatheus")
        .where("email", "==", email).where("senha", "==", senha)
        .get()
        .then((usuarioConsultaSnap) => {
          if (usuarioConsultaSnap.empty) {
            HttpUtil.falha("Usuario ou senha inválidas", response);
          } else {
            var usuario = ManterUsuario.toManterUsuario(
              usuarioConsultaSnap.docs[0].data());
            HttpUtil.sucesso(usuario.toJson(), response);
          }
        })
        .catch((erro) => {
          HttpUtil.falha("Ops! Houve um erro " + erro, response);
        });
    }
  }

  /**
   * editarUsuario
   */
  public editarUsuario(request: Request, response: Response) {
    var usuarioEditar = ManterUsuario.toManterUsuario(request.body);
    if (usuarioEditar.isUsuarioValido() && usuarioEditar.id !== undefined && usuarioEditar.id !== "") {
        this.db.doc(`usuariosmatheus/${usuarioEditar.id}`).set(usuarioEditar.toJson()).then(
            resultadoSnap => {
                HttpUtil.sucesso("Usuário editado com sucesso", response);
            }
        ).catch(erro => {
            HttpUtil.falha("Erro ao editar usuário", response);
        })
    } else {
        HttpUtil.falha("O usuário é inválido", response);
    }
  }
}
