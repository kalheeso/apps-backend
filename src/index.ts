import * as functions from "firebase-functions";
import * as express from 'express';
import * as admin from 'firebase-admin';
import { UsuarioService } from "./services/Usuarios.service";
import { PostagemService } from "./services/Postagem.service";

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const usuarioExpress = express();
const usuarioService = new UsuarioService(db);

usuarioExpress.post('/cadastrarUsuario', (req, res) => usuarioService.cadastrarUsuario(req, res));
usuarioExpress.get('/logarUsuario', (req, res) => usuarioService.logarUsuario(req, res));
usuarioExpress.post('/editarUsuario', (req, res) => usuarioService.editarUsuario(req, res));

export const usuariosMatheus = functions.https.onRequest(usuarioExpress);

const postagemExpress = express();
const postagemService = new PostagemService(db);

postagemExpress.post("/manterPostagem", (req, res) => postagemService.manterPostagem(req, res));
postagemExpress.post("/comentarPost", (req, res) => postagemService.comentarPostagem(req, res));
postagemExpress.delete("/excluirPostagem", (req, res) => postagemService.excluirPostagem(req, res));
postagemExpress.delete("/excluirComentario", (req, res) => postagemService.excluirComentario(req, res));
postagemExpress.post("/darDislike", (req, res) => postagemService.darDislike(req, res));
postagemExpress.post("/darLike", (req, res) => postagemService.darLike(req, res));
postagemExpress.get("/consultarPosts", (req, res) => postagemService.listarPosts(req, res));

export const feedMatheus = functions.https.onRequest(postagemExpress);