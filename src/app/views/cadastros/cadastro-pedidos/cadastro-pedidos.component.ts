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
import { Catalogo } from '../model/catalogo.model';

@Component({
  selector: "cadastro-pedidos",
  templateUrl: "./cadastro-pedidos.component.html",
  styleUrls: ["./cadastro-pedidos.component.css"],
})
export class CadastroPedidosComponent implements OnInit {
  private subscriptions: Subscription[] = [];

  forma_pagamento : FormasPagamentos[] = [];
  pedidoForm: FormGroup;
  dia_semana: DiaSemana[] = [];

  pedido: Pedido = {
    _id:'',
    data: new Date(),
    dia_entrega: DiaSemana.SABADO,
    forma_pagamento: FormasPagamentos.DINHEIRO,
    numero_celular: "",
    pago: false,
    produto_pedido: [],
    status: Status.EM_ANDAMENTO,
    total_pedido: 0,
  };

  catalogoAtual:Catalogo;

  constructor(
    private fb: FormBuilder,
    public produtosService: ProdutosService,
    public dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,
    private catalogoService: CatalogoService,
    private activatedRoute: ActivatedRoute
  ) {}

  onSubmit() {
    alert("Thanks!");
  }

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

  listarCatAtual(){
    this.catalogoService.buscarAtual().then((c)=>{   
      if(c.length>0){   
        this.catalogoAtual = c[0];
      }else{
        this.catalogoAtual = null;
      }
    });
  }

  voltar() {
    this.router.navigate(["../", ""], {
      relativeTo: this.activatedRoute,
    });
  }
}
