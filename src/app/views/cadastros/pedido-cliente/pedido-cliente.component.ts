import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormasPagamentos } from '../model/formas-pagamento.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DiaSemana } from '../model/dia-semana.enum';
import { Produto } from '../model/produto.model';
import { Pedido } from '../model/pedido.model';
import { Status } from '../model/status.enum';
import { Catalogo } from '../model/catalogo.model';
import { ProdutosService } from '../services/produtos.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CatalogoService } from '../services/catalogo.service';
import { PedidosService } from '../services/pedidos.service';
import { unidades } from '../model/unidade-medida';

@Component({
  selector: 'app-pedido-cliente',
  templateUrl: './pedido-cliente.component.html',
  styleUrls: ['./pedido-cliente.component.css']
})
export class PedidoClienteComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  forma_pagamento: FormasPagamentos[] = [];
  pedidoForm: FormGroup;
  dia_semana: DiaSemana[] = [];
  produtos_disponoveis: Produto[] = [];
  total :number = 0;
  urlWpp = "https://api.whatsapp.com/send?" + "phone=55";
  link:string;

  pedido: Pedido = {
    _id: "",
    data: new Date(),
    dia_entrega: DiaSemana.SABADO,
    forma_pagamento: FormasPagamentos.DINHEIRO,
    numero_celular: "",
    pago: false,
    produto_pedido: [],
    status: Status.EM_ANDAMENTO,
    total_pedido: 0,
    catalogo:null,
  };

  catalogoAtual: Catalogo;
  

  constructor(
    private fb: FormBuilder,
    public produtosService: ProdutosService,
    public dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,
    private catalogoService: CatalogoService,
    private activatedRoute: ActivatedRoute,
    private pedidosService: PedidosService
  ) {}

  ngOnInit() {
    // this.dia_semana.push(DiaSemana.QUINTA);
    this.dia_semana.push(DiaSemana.SEXTA);
    this.dia_semana.push(DiaSemana.SABADO);
    this.forma_pagamento.push(FormasPagamentos.BOLETO);
    this.forma_pagamento.push(FormasPagamentos.DEBITO);
    this.forma_pagamento.push(FormasPagamentos.DINHEIRO);
    this.forma_pagamento.push(FormasPagamentos.TRANFERENCIA);
    this.createForm();
    

    this.createForm();
    const routeSubscription = this.activatedRoute.params.subscribe(
			(params) => {
				const id = params.id;
				if (id && id.length > 0) {
					const material = this.pedidosService
						.read(id)
            .valueChanges();            
					material.subscribe((value) => {
            this.pedido._id = id;
            this.pedido.data = value.data;
            this.pedido.dia_entrega = value.dia_entrega;
            this.pedido.forma_pagamento =value.forma_pagamento;
            this.pedido.numero_celular = value.numero_celular;
            this.pedido.pago = value.pago;
            this.pedido.produto_pedido = value.produto_pedido;
            this.pedido.status = value.status;
            this.pedido.total_pedido = value.total_pedido;
            this.pedido.catalogo =  value.catalogo;
            this.catalogoAtual = value.catalogo;
            this.catalogoAtual.produtos = this.pedido.produto_pedido;
            this.calculaTotal();
            this.createForm();
					});						
				} else{
          this.listarCatAtual();
        }
			}
		);
		this.subscriptions.push(routeSubscription);
  }

  listarCatAtual() {
    
    this.catalogoService.buscarAtual().then((c) => {
      if (c.length > 0) {
        this.catalogoAtual = c[0];
      } else {
       this.router.navigate(["error"]);
      }
    });
  }

  onSubmit() {
    const controls = this.pedidoForm.controls;
    let existeAtual: boolean = false;
    /** check form */
    if (this.pedidoForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    const prod: Pedido = this.preparePedido();

    if (prod._id) {
      this.updatePedido(prod);
      return;
    }

    this.addPedido(prod);
  }

  addPedido(p: Pedido) {
    this.pedidosService.create(p).then(() => {
      this.toastr.success("Pedido cadastrado com sucesso", "Atenção!", {
        closeButton: true,
        progressAnimation: "decreasing",
        progressBar: true,
      });   
      this.enviarWpp(p);   
    });
  }
  updatePedido(p: Pedido) {
    this.pedidosService.update(p._id, p).then(() => {
      this.toastr.success("Pedido atualizado com sucesso", "Atenção!", {
        closeButton: true,
        progressAnimation: "decreasing",
        progressBar: true,
      });
    });
    this.enviarWpp(p);
  }
  preparePedido(): Pedido {
    const controls = this.pedidoForm.controls;

    const p: Pedido = {
      _id: controls._id.value,
      data: controls.data.value,
      dia_entrega: controls.dia_entrega.value,
      forma_pagamento: controls.forma_pagamento.value,
      numero_celular: controls.numero_celular.value,
      pago: controls.pago.value,
      produto_pedido: [],
      status: controls.status.value,
      total_pedido: controls.total_pedido.value,
      catalogo:this.catalogoAtual,
    };

    p.produto_pedido = this.catalogoAtual.produtos.filter((p:Produto)=>{
      return p.quantidade > 0;
    });
    
    p.total_pedido = this.total;

    delete this.catalogoAtual.produtos;
    delete this.catalogoAtual.pedidos;

    return p;
  }

  enviarWpp(p: Pedido){
    let mensagem=JSON.stringify(p.produto_pedido);
    let numero = this.apenasNumeros(p.numero_celular);
    this.link = this.urlWpp + 'phone=55' + this.apenasNumeros(numero) + '&text=' + mensagem;
  }

  createForm() {
    this.pedidoForm = this.fb.group({
      _id: [this.pedido._id],
      data: [this.pedido.data, Validators.required],
      dia_entrega: [this.pedido.dia_entrega],
      numero_celular: [this.pedido.numero_celular, Validators.required],
      pago: [this.pedido.pago],
      produto_pedido: [this.pedido.produto_pedido],
      status: [this.pedido?.status, Validators.required],
      total_pedido: [this.pedido?.total_pedido, Validators.required],
      forma_pagamento: [this.pedido?.forma_pagamento, Validators.required],
    });
  }

  apenasNumeros(string) {
    var numsStr = string.replace(/[^0-9]/g, '');
    return parseInt(numsStr);
  }


  voltar() {
    this.router.navigate(["lista-de-pedidos"]);
  }

  atualizarCat() {
    this.catalogoService
      .update(this.catalogoAtual._id, this.catalogoAtual)
      .then(() => {});
  }

  decrementarProd(p: Produto) {
    if (p.quantidade && p.quantidade > 0) {
      p.quantidade--;
    } else {
      p.quantidade = 0;
    }
    this.calculaValor(p);
  }

  incrementarProd(p: Produto) {
    if (p.quantidade) {
      p.quantidade++;
    } else {
      p.quantidade = 0;
      p.quantidade++;
    }
    this.calculaValor(p);
  }

  calculaValor(p: Produto) {
    if (p.limite > 0 && p.quantidade >= p.limite) {
      p.valor_total = p.valorB * p.quantidade;
    } else {
      p.valor_total = p.valorA * p.quantidade;
    }
    this.calculaTotal();
  }

  convertToProdutoPedido(p: Produto) {
    let pd: Produto = {
      _id: "",
      descricao: "",
      limite: 0,
      observacao: "",
      quantidade: 0,
      unidade_medida: p.unidade_medida,
      valorA: 0,
      valorB: 0,
      valor_total: 1,
    };
  }

  tipoUnidademedida(p: Produto) {
    if (p.limite > 0 && p.quantidade >= p.limite && p.unidade_medida.id == 1) {
      p.unidade_medida = unidades[2];
    }
    return p.unidade_medida.descricao;
  }

  calculaTotal(){
    this.total = 0;
    this.catalogoAtual.produtos.forEach((p:Produto)=>{
      if(p.valor_total){
        this.total = this.total + p.valor_total;
      }
    });
  }
}
