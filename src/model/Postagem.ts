import { ManterUsuario } from "./ManterUsuario";
import { Comentario } from "./Comentario";

export class Postagem {
    conteudo?: string;
    dataDePostagem?: Date;
    criador?: ManterUsuario;
    likes?: ManterUsuario[];
    comentarios?: Comentario[];
    id?: string;

    constructor(conteudo?: string, dataDePostagem?: Date, criador?: ManterUsuario,
        likes?: ManterUsuario[], comentarios?: Comentario[], id?: string) {
            this.conteudo = conteudo;
            this.dataDePostagem = dataDePostagem;
            this.criador = criador; 
            this.likes = likes;
            this.comentarios = comentarios;        
            this.id = id;
    }

    
    public isPostValido(): boolean{
        return this.conteudo !== undefined && this.criador !== undefined;
    }

    static toPostagem(json: any): Postagem{
        return new Postagem(json.conteudo, new Date(json.dataDePostagem), 
        ManterUsuario.toManterUsuario(json.criador),
        json.likes, json.comentarios, json.id);
    }

    public toJson(): any {
        return JSON.parse(JSON.stringify(this));
    }
}