import * as functions from "firebase-functions";
import * as express from 'express';
import * as admin from 'firebase-admin';
import { UsuarioService } from "./services/Usuarios.service";
import { PostagemService } from "./services/Postagem.service";
import { UserService } from "./services/User.service";
import { MoodService } from "./services/Mood.service";

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

const userExpress = express();
const userService = new UserService(db);

//********************************************************
//********************************************************

userExpress.post("/registerUser", (req, res) => userService.registerUser(req, res));
userExpress.post("/loginUser", (req, res) => userService.loginUser(req, res));
userExpress.post("/editUser", (req, res) => userService.editUser(req, res));

export const usersMatheus = functions.https.onRequest(userExpress);

const moodExpress = express();
const moodService = new MoodService(db);

moodExpress.post("/postEditMood", (req, res) => moodService.postEditMood(req, res));
moodExpress.delete("/deleteMood", (req, res) => moodService.deleteMood(req, res));
moodExpress.get("/readSingleMood", (req, res) => moodService.readSingleMood(req, res));
moodExpress.get("/listMoods", (req, res) => moodService.listMoods(req, res));
moodExpress.get("/listMoodsByDay", (req, res) => moodService.listMoodsByDay(req, res));

export const moodsMatheus = functions.https.onRequest(moodExpress);

