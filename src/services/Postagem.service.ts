import { firestore } from "firebase-admin";
import { HttpUtil } from "../util/HttpUtil";
import { Response, Request } from "express";
import { Postagem } from "../model/Postagem";
import { Comentario } from "../model/Comentario";
import { ManterUsuario } from "../model/ManterUsuario";

export class PostagemService {
  private db: firestore.Firestore;

  constructor(db: firestore.Firestore) {
    this.db = db;
  }

  //realiza e edita post
  public manterPostagem(request: Request, response: Response) {
    if (request.body === undefined) {
      request.body = {};
    }
    let postagem = Postagem.toPostagem(request.body);
    if (postagem.isPostValido()) {
      if (
        postagem.id === undefined ||
        postagem.id === null ||
        postagem.id === "null"
      ) {
        postagem.id = this.db.collection("x").doc().id;
        postagem.dataDePostagem = new Date();
      } else {
        delete postagem.dataDePostagem;
      }
      this.db
        .doc(`publicacoesmatheus/${postagem.id}`)
        .set(postagem.toJson(), { merge: true })
        .then((resultadoSnap) => {
          HttpUtil.sucesso(postagem.toJson(), response);
        })
        .catch((erro) => {
          HttpUtil.falha("Erro ao postar " + erro, response);
        });
    } else {
      HttpUtil.falha("Postagem ou criador inválido", response);
    }
  }

  public comentarPostagem(request: Request, response: Response) {
    let idPostagem = request.query.id;
    let comentario = Comentario.toComentario(request.body);
    let post: Postagem;
    if (idPostagem === undefined || idPostagem === "") {
      HttpUtil.falha("O parâmetro id não pode ser nulo", response);
    } else if (!comentario.isComentarioValido()) {
      HttpUtil.falha("O comentário deve ser preenchido", response);
    } else {
      this.db
        .doc(`publicacoesmatheus/${idPostagem}`)
        .get()
        .then((postSnap) => {
          post = Postagem.toPostagem(postSnap.data());
          comentario.dataDoComentario = new Date();
          comentario.id = this.db.collection("x").doc().id;
          if (post.comentarios === undefined) {
            post.comentarios = [];
          }
          post.comentarios.push(comentario);
          return postSnap.ref.set(post.toJson(), { merge: true });
        })
        .then((_) => {
          HttpUtil.sucesso(post.toJson(), response);
        })
        .catch((erro) => {
          HttpUtil.falha(
            "Houve uma falha ao tentar inserir o comentário" + erro,
            response
          );
        });
    }
  }

  public excluirPostagem(request: Request, response: Response) {
    if (request.query.id === undefined || request.query.id === "") {
      HttpUtil.falha("Post inválido", response);
    } else {
      this.db
        .doc(`publicacoesmatheus/${request.query.id}`)
        .delete()
        .then((_) => {
          HttpUtil.sucesso("Post excluido com sucesso", response);
        })
        .catch((erro) => {
          HttpUtil.falha("Ops! Tive uma falha", response);
        });
    }
  }

  public excluirComentario(request: Request, response: Response) {
    const idPostagem = request.query.idPostagem;
    const idComentario = request.query.id;
    var postagem: Postagem;
    if (
      idPostagem === undefined ||
      idPostagem === "" ||
      idComentario === undefined ||
      idComentario === ""
    ) {
      HttpUtil.falha("Post ou comentário inválido", response);
    } else {
      this.db
        .doc(`publicacoesmatheus/${idPostagem}`)
        .get()
        .then((postSnap) => {
          postagem = Postagem.toPostagem(postSnap.data());
          postagem.comentarios = postagem.comentarios?.filter(
            (c) => c.id !== idComentario
          );
          return postSnap.ref.set(postagem.toJson());
        })
        .then((_) => {
          HttpUtil.sucesso(postagem.toJson(), response);
        })
        .catch((erro) => {
          HttpUtil.falha("Houve um erro inesperado " + erro, response);
        });
    }
  }

  public darLike(request: Request, response: Response) {
    let idPostagem = request.query.id;
    let like = ManterUsuario.toManterUsuario(request.body);
    let postagem: Postagem;
    if (like.id === undefined || like.id === "") {
      like.id = this.db.collection("x").doc().id;
    }
    if (idPostagem === undefined || idPostagem === "" || like === undefined) {
      HttpUtil.falha(
        "O like não pode ser dado, pois o id está vazio",
        response
      );
    } else {
      this.db
        .doc(`publicacoesmatheus/${idPostagem}`)
        .get()
        .then((postSnap) => {
          postagem = Postagem.toPostagem(postSnap.data());
          if (postagem.likes === undefined) {
            postagem.likes = [];
          }
          postagem.likes.push(like);
          return postSnap.ref.set(postagem.toJson());
        })
        .then((_) => {
          HttpUtil.sucesso(postagem.toJson(), response);
        })
        .catch((erro) => {
          HttpUtil.falha("Ops, houve um erro inesperado" + erro, response);
        });
    }
  }

  public darDislike(request: Request, response: Response) {
    let idPostagem = request.query.id;
    let idUsuario = request.query.idUsuario;
    let postagem: Postagem;
    if (
      idPostagem === undefined ||
      idPostagem === "" ||
      idUsuario === undefined ||
      idUsuario === ""
    ) {
      HttpUtil.falha("Erro! Insira id da publicação e do usuário", response);
    } else {
      this.db
        .doc(`publicacoesmatheus/${idPostagem}`)
        .get()
        .then((postSnap) => {
          postagem = Postagem.toPostagem(postSnap.data());
          if (postagem.likes?.length == 0) {
            HttpUtil.falha("Like the post before unliking it", response);
          }
          postagem.likes = postagem.likes?.filter((l) => l.id !== idUsuario);
          return postSnap.ref.set(postagem.toJson());
        })
        .then((_) => {
          HttpUtil.sucesso(postagem.toJson(), response);
        })
        .catch((erro) => {
          HttpUtil.falha("Ops! Houve um erro inesperado " + erro, response);
        });
    }
  }

  public listarPosts(request: Request, response: Response) {
    this.db
      .collection("publicacoesmatheus")
      .orderBy("dataDePostagem", "desc")
      .get()
      .then((postsSnap) => {
        let listaPosts: Postagem[] = [];
        postsSnap.docs.forEach((postSnap) => {
          listaPosts.push(Postagem.toPostagem(postSnap.data()));
        });
        HttpUtil.sucesso(listaPosts, response);
      })
      .catch((erro) => {
        HttpUtil.falha("Houve um erro ao listar os posts" + erro, response);
      });
  }
}
