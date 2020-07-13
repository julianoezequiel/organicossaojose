import { ProdutoPedido } from './produto-pedido.model';
import { FormasPagamentos } from './formas-pagamento.enum';
import { DiaSemana } from './dia-semana.enum';
import { Status } from './status.enum';

export class Pedido {
    data:Date;
    _id:string;
    numero_celular:string;
    produto_pedido:ProdutoPedido[];
    total_pedido:number;
    status:Status;
    forma_pagamento:FormasPagamentos;
    dia_entrega:DiaSemana;
    pago:boolean;
}
