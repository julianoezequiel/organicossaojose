import { Produto } from './produto.model';

export interface ProdutoPedido extends Produto{
    quantidade:number;
    valor_total:number;
}