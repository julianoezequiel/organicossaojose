import { Produto } from './produto.model';
import { FormaSPagamentos } from './formas-pagamento.enum';

export interface Catalogo{
    data_entrega:Date;
    
    dia_confirmar:DiaSemana;
    hora_confirmar:number;
    
    hora_inicio_entrega:string;

    produtos: Produto[];
    

}