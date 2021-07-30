import { ManterUsuario } from "./ManterUsuario";

export class Comentario {
    dataDoComentario?: Date;
    comentario?: string;
    criador?: ManterUsuario;
    id?: string;

    constructor(dataDoComentario?: Date, comentario?: string, criador?: ManterUsuario, id?: string) {
        this.dataDoComentario = dataDoComentario;
        this.comentario = comentario;
        this.criador = criador;
        this.id = id;
    }

    public isComentarioValido(): boolean{
        return this.criador !== undefined && this.comentario !== undefined && this.comentario !== "";
    }

    static toComentario(json: any): Comentario{
        return new Comentario(json.dataDoComentario, json.comentario,
             ManterUsuario.toManterUsuario(json.criador), json.id);
    }

    public toJson(): any {
        return JSON.parse(JSON.stringify(this));
    }
}