import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ListaProdutosCatalogoComponent } from "./lista-produtos-catalogo/lista-produtos-catalogo.component";
import { Produto } from "../model/produto.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Catalogo } from "../model/catalogo.model";
import { DiaSemana } from "../model/dia-semana.enum";
import { ToastrService } from "ngx-toastr";
import { CatalogoService } from "../services/catalogo.service";
import { Subscription } from 'rxjs';
import { Pedido } from '../model/pedido.model';

@Component({
  selector: "app-catalogo",
  templateUrl: "./catalogo.component.html",
  styleUrls: ["./catalogo.component.css"],
})
export class CatalogoComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private catalogoService: CatalogoService,
    private activatedRoute: ActivatedRoute,
  ) {}

  private subscriptions: Subscription[] = [];
  
  catalogoForm: FormGroup;
  list: Produto[] = [];
  pedidos:Pedido[]=[];
  catalogo: Catalogo;
  dia_semana: DiaSemana[] = [];

  ngOnInit(): void {
    this.dia_semana.push(DiaSemana.QUINTA);
    this.dia_semana.push(DiaSemana.SEXTA);
    this.dia_semana.push(DiaSemana.SABADO);
    this.catalogo = {
      _id: "",
      produtos: [],
      data_entrega: new Date(),
      data_string:'',
      dia_confirmar: DiaSemana.SEXTA,
      hora_confirmar: "14h",
      hora_inicio_entrega: "14h",
      pedidos:[],
      atual:false
    };

    this.createForm();
    const routeSubscription = this.activatedRoute.params.subscribe(
			(params) => {
				const id = params.id;
				if (id && id.length > 0) {
					const material = this.catalogoService
						.read(id)
            .valueChanges();            
					material.subscribe((value) => {
            this.catalogo._id = value._id;
            this.catalogo.dia_confirmar = value.dia_confirmar;
            this.catalogo.hora_confirmar = value.hora_confirmar;
            this.catalogo.hora_inicio_entrega = value.hora_inicio_entrega;
            this.catalogo.produtos = value.produtos;
            this.catalogo.data_entrega = new Date(value.data_entrega.seconds  * 1000);
            this.catalogo._id = id;
            this.catalogo.atual = value.atual;
            this.list = this.catalogo.produtos;

            this.createForm();
					});						
				} 
			}
		);
		this.subscriptions.push(routeSubscription);
  }

  createForm() {
    this.catalogoForm = this.fb.group({
      _id: [this.catalogo._id],
      data_entrega: [new Date(this.catalogo.data_entrega), Validators.required],
      dia_confirmar: [this.catalogo.dia_confirmar, Validators.required],
      hora_confirmar: [this.catalogo.hora_confirmar, Validators.required],
      hora_inicio_entrega: [
        this.catalogo.hora_inicio_entrega,
        Validators.required,
      ],
      atual:[this.catalogo.atual]
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ListaProdutosCatalogoComponent, {
      width: "250px",
      data: this.list,
    });

    dialogRef.afterClosed().subscribe((result: Produto[]) => {
      if (result.length > 0) {
        this.list = result;
      }
    });
  }

  remover(p: Produto) {
    let index = this.list.indexOf(p);
    this.list.splice(index, 1);
  }

  voltar() {
    this.router.navigate(["../"], {});
  }

  async onSubmit() {
    const controls = this.catalogoForm.controls;
    let existeAtual :boolean = false;
    /** check form */
    if (this.catalogoForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    await this.catalogoService.buscarAtual().then((a)=>{
      if(a.length>0){
        a.forEach((aa:Catalogo)=>{
          if(aa._id != this.catalogo._id && aa.atual == true){
            existeAtual = true;
          }
        })
      }
    });

    if(existeAtual && this.catalogo.atual){
      this.toastr.warning("Existe um catálogo em uso,desative o catálogo anterior!", "Atenção!", {
        closeButton: true,
        progressAnimation: "decreasing",
        progressBar: true,
      });
      return;
    }

    if (this.list.length == 0) {
      this.toastr.warning("Adicione produtos ao catálogo!", "Atenção!", {
        closeButton: true,
        progressAnimation: "decreasing",
        progressBar: true,
      });
      return;
    }

    const prod: Catalogo = this.prepareCatalogo();

    if (prod._id) {
      this.updateCatalogo(prod);
      return;
    }

    this.addCatalogo(prod);
  }

  addCatalogo(prod: Catalogo) {
    this.catalogoService.create(prod).then((result) => {
      this.toastr.success("Catálogo cadastrado com sucesso", "Atenção!", {
        closeButton: true,
        progressAnimation: "decreasing",
        progressBar: true,
      });
      this.router.navigate(["../lista-de-catalogo"], {});
    });
  }

  updateCatalogo(prod: Catalogo) {
    this.catalogoService.update(prod._id, prod).then((result) => {
      this.toastr.success("Catálogo atualizado com sucesso", "Atenção!", {
        closeButton: true,
        progressAnimation: "decreasing",
        progressBar: true,
      });
      this.router.navigate(["../lista-de-catalogo"], {});
    });
  }

  prepareCatalogo(): Catalogo {
    const controls = this.catalogoForm.controls;

    const catalogo: Catalogo = {
      _id: controls._id.value,
      produtos: this.list,
      data_entrega: controls.data_entrega.value,
      data_string:'',
      dia_confirmar: controls.dia_confirmar.value,
      hora_confirmar: controls.hora_confirmar.value,
      hora_inicio_entrega: controls.hora_inicio_entrega.value,
      pedidos:this.pedidos,
      atual:controls.atual.value
    };

    return catalogo;
  }
}
