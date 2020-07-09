import { ProdutoPedido } from './produto-pedido.model';
import { FormasPagamentos } from './formas-pagamento.enum';

export class Pedido {
    data:Date;
    numero_celular:string;
    produto_pedido:ProdutoPedido[];
    total_pedido:number;
    status:Status;
    forma_pagamento:FormasPagamentos;
    dia_entrega:DiaSemana;
    pago:boolean;
}
