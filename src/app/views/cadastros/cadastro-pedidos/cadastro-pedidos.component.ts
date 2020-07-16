import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ProdutosService } from "../services/produtos.service";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CatalogoService } from "../services/catalogo.service";
import { Subscription } from "rxjs";
import { Pedido } from "../model/pedido.model";
import { DiaSemana } from "../model/dia-semana.enum";
import { FormasPagamentos } from "../model/formas-pagamento.enum";
import { Status } from "../model/status.enum";
import { Catalogo } from "../model/catalogo.model";
import { PedidosService } from "../services/pedidos.service";
import { Produto } from "../model/produto.model";
import { UnidadeMedida, unidades } from "../model/unidade-medida";

@Component({
  selector: "cadastro-pedidos",
  templateUrl: "./cadastro-pedidos.component.html",
  styleUrls: ["./cadastro-pedidos.component.css"],
})
export class CadastroPedidosComponent implements OnInit {
  private subscriptions: Subscription[] = [];

  forma_pagamento: FormasPagamentos[] = [];
  pedidoForm: FormGroup;
  dia_semana: DiaSemana[] = [];
  produtos_disponoveis: Produto[] = [];

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
    this.dia_semana.push(DiaSemana.QUINTA);
    this.dia_semana.push(DiaSemana.SEXTA);
    this.dia_semana.push(DiaSemana.SABADO);
    this.forma_pagamento.push(FormasPagamentos.BOLETO);
    this.forma_pagamento.push(FormasPagamentos.DEBITO);
    this.forma_pagamento.push(FormasPagamentos.DINHEIRO);
    this.forma_pagamento.push(FormasPagamentos.TRANFERENCIA);
    this.createForm();
    this.listarCatAtual();
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
      this.router.navigate(["../"], {});
    });
  }
  updatePedido(p: Pedido) {
    this.pedidosService.update(p._id, p).then(() => {
      this.toastr.success("Pedido atualizado com sucesso", "Atenção!", {
        closeButton: true,
        progressAnimation: "decreasing",
        progressBar: true,
      });
      this.router.navigate(["../"], {});
    });
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
    };

    return p;
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

  listarCatAtual() {
    this.catalogoService.buscarAtual().then((c) => {
      if (c.length > 0) {
        this.catalogoAtual = c[0];
      } else {
        this.catalogoAtual = null;
      }
    });
  }

  voltar() {
    this.router.navigate(["../", ""], {
      relativeTo: this.activatedRoute,
    });
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
}
