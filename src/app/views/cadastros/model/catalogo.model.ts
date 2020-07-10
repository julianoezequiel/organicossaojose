import { Produto } from "./produto.model";
import { DiaSemana } from "./dia-semana.enum";

export interface Catalogo {
  _id: string;

  data_entrega: Date;

  dia_confirmar: DiaSemana;
  hora_confirmar: string;

  hora_inicio_entrega: string;

  produtos: Produto[];
}
