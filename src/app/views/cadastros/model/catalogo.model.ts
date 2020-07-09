import { Produto } from './produto.model';

export interface Catalogo{
    data_entrega:Date;
    
    dia_confirmar:DiaSemana;
    hora_confirmar:number;
    
    hora_inicio_entrega:string;

    produtos: Produto[];
    

}