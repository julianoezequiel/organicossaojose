import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Produto } from "../model/produto.model";
import { unidades, UnidadeMedida } from "../model/unidade-medida";
import { ProdutosService } from "../services/produtos.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';

@Component({
  selector: "cadastro-produtos",
  templateUrl: "./cadastro-produtos.component.html",
  styleUrls: ["./cadastro-produtos.component.css"],
})
export class CadastroProdutosComponent implements OnInit {
  
  private subscriptions: Subscription[] = [];
  titulo: BehaviorSubject<string> = new BehaviorSubject<string>("");

  medidas: UnidadeMedida[];
  produtoForm: FormGroup;
  produto: Produto = {
    _id: "",
    descricao: "",
    observacao: "",
    unidade_medida: unidades[0],
    valorA: 0,
    valorB: 0,
    limite: 2,
  };

  hasUnitNumber = false;

  states = [
    { name: "Alabama", abbreviation: "AL" },
    { name: "Alaska", abbreviation: "AK" },
    { name: "American Samoa", abbreviation: "AS" },
    { name: "Arizona", abbreviation: "AZ" },
    { name: "Arkansas", abbreviation: "AR" },
    { name: "California", abbreviation: "CA" },
    { name: "Colorado", abbreviation: "CO" },
    { name: "Connecticut", abbreviation: "CT" },
    { name: "Delaware", abbreviation: "DE" },
    { name: "District Of Columbia", abbreviation: "DC" },
    { name: "Federated States Of Micronesia", abbreviation: "FM" },
    { name: "Florida", abbreviation: "FL" },
    { name: "Georgia", abbreviation: "GA" },
    { name: "Guam", abbreviation: "GU" },
    { name: "Hawaii", abbreviation: "HI" },
    { name: "Idaho", abbreviation: "ID" },
    { name: "Illinois", abbreviation: "IL" },
    { name: "Indiana", abbreviation: "IN" },
    { name: "Iowa", abbreviation: "IA" },
    { name: "Kansas", abbreviation: "KS" },
    { name: "Kentucky", abbreviation: "KY" },
    { name: "Louisiana", abbreviation: "LA" },
    { name: "Maine", abbreviation: "ME" },
    { name: "Marshall Islands", abbreviation: "MH" },
    { name: "Maryland", abbreviation: "MD" },
    { name: "Massachusetts", abbreviation: "MA" },
    { name: "Michigan", abbreviation: "MI" },
    { name: "Minnesota", abbreviation: "MN" },
    { name: "Mississippi", abbreviation: "MS" },
    { name: "Missouri", abbreviation: "MO" },
    { name: "Montana", abbreviation: "MT" },
    { name: "Nebraska", abbreviation: "NE" },
    { name: "Nevada", abbreviation: "NV" },
    { name: "New Hampshire", abbreviation: "NH" },
    { name: "New Jersey", abbreviation: "NJ" },
    { name: "New Mexico", abbreviation: "NM" },
    { name: "New York", abbreviation: "NY" },
    { name: "North Carolina", abbreviation: "NC" },
    { name: "North Dakota", abbreviation: "ND" },
    { name: "Northern Mariana Islands", abbreviation: "MP" },
    { name: "Ohio", abbreviation: "OH" },
    { name: "Oklahoma", abbreviation: "OK" },
    { name: "Oregon", abbreviation: "OR" },
    { name: "Palau", abbreviation: "PW" },
    { name: "Pennsylvania", abbreviation: "PA" },
    { name: "Puerto Rico", abbreviation: "PR" },
    { name: "Rhode Island", abbreviation: "RI" },
    { name: "South Carolina", abbreviation: "SC" },
    { name: "South Dakota", abbreviation: "SD" },
    { name: "Tennessee", abbreviation: "TN" },
    { name: "Texas", abbreviation: "TX" },
    { name: "Utah", abbreviation: "UT" },
    { name: "Vermont", abbreviation: "VT" },
    { name: "Virgin Islands", abbreviation: "VI" },
    { name: "Virginia", abbreviation: "VA" },
    { name: "Washington", abbreviation: "WA" },
    { name: "West Virginia", abbreviation: "WV" },
    { name: "Wisconsin", abbreviation: "WI" },
    { name: "Wyoming", abbreviation: "WY" },
  ];

  constructor(
    private fb: FormBuilder,
    private produtosService: ProdutosService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.medidas = unidades;
  }

  ngOnInit() {
    this.createForm();
    const routeSubscription = this.activatedRoute.params.subscribe(
			(params) => {
				const id = params.id;
				if (id && id.length > 0) {
					const material = this.produtosService
						.read(id)
            .valueChanges();            
					material.subscribe((value) => {
						this.produto = value;
						this.produto._id = id;
            this.titulo.next(`Editar - ${this.produto.descricao}`)	;	
            this.createForm();
					});						
				} else{
					this.titulo.next("Novo");
				}
			}
		);
		this.subscriptions.push(routeSubscription);
  }

  createForm() {
    this.produtoForm = this.fb.group({
      _id: [this.produto._id],
      descricao: [this.produto.descricao, Validators.required],
      observacao: [this.produto.descricao],
      valorA: [this.produto.valorA, Validators.required],
      valorB: [this.produto.valorB],
      limite: [this.produto.limite],
      unidade_medida: [this.produto?.unidade_medida?.id, Validators.required],
    });
  }

  onSubmit() {
    const controls = this.produtoForm.controls;
    /** check form */
    if (this.produtoForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    const prod: Produto = this.prepareProduto();

    if (prod._id) {
      this.updateProduto(prod);
      return;
    }

    this.addproduto(prod);
  }

  addproduto(prod: Produto) {
    this.produtosService.create(prod).then((result) => {
      this.toastr.success("Produto cadastrado com sucesso", "Atenção!", {
        closeButton: true,
        progressAnimation: "decreasing",
        progressBar: true,
      });
      console.log(result);
      this.router.navigateByUrl("lista-de-produtos", {
        relativeTo: this.activatedRoute,
      });
    });
  }

  updateProduto(prod: Produto) {
    this.produtosService.update(prod._id, prod).then((result) => {
      this.toastr.success("Produto atualizado com sucesso", "Atenção!", {
        closeButton: true,
        progressAnimation: "decreasing",
        progressBar: true,
      });
      console.log(result);
    });
  }

  prepareProduto(): Produto {
    const controls = this.produtoForm.controls;
    const produto: Produto = {
      _id: controls._id.value,
      descricao: controls.descricao.value,
      valorA: controls.valorA.value,
      valorB: controls.valorB.value,
      limite: controls.limite.value,
      observacao: controls.observacao.value,
      unidade_medida: this.medidas[controls.unidade_medida.value -1],
    };

    return produto;
  }

  voltar(){
    this.router.navigate(["../lista-de-produtos"], {});
  }
}
