import { ProdutoPedido } from './produto-pedido.model';
import { FormaSPagamentos } from './formas-pagamento.enum';

export class Pedido {
    data:Date;
    numero_celular:string;
    produto_pedido:ProdutoPedido[];
    total_pedido:number;
    status:Status;
    forma_pagamento:FormaSPagamentos;
}
