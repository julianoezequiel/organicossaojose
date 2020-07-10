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

  catalogoForm: FormGroup;
  list: Produto[] = [];
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
      dia_confirmar: DiaSemana.SEXTA,
      hora_confirmar: "14h",
      hora_inicio_entrega: "14h",
    };

    this.createForm();
  }

  createForm() {
    this.catalogoForm = this.fb.group({
      _id: [this.catalogo._id],
      data_entrega: [this.catalogo.data_entrega, Validators.required],
      dia_confirmar: [this.catalogo.dia_confirmar, Validators.required],
      hora_confirmar: [this.catalogo.hora_confirmar, Validators.required],
      hora_inicio_entrega: [
        this.catalogo.hora_inicio_entrega,
        Validators.required,
      ],
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

  onSubmit() {
    const controls = this.catalogoForm.controls;
    /** check form */
    if (this.catalogoForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
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
      this.router.navigate(["../"], {});
    });

  }

  updateCatalogo(prod: Catalogo) {
    this.catalogoService.update(prod._id, prod).then((result) => {
      this.toastr.success("Catálogo atualizado com sucesso", "Atenção!", {
        closeButton: true,
        progressAnimation: "decreasing",
        progressBar: true,
      });
      this.router.navigate(["../"], {});
    });
  }

  prepareCatalogo(): Catalogo {
    const controls = this.catalogoForm.controls;

    const catalogo: Catalogo = {
      _id: controls._id.value,
      produtos: this.list,
      data_entrega: controls.data_entrega.value,
      dia_confirmar: controls.dia_confirmar.value,
      hora_confirmar: controls.hora_confirmar.value,
      hora_inicio_entrega: controls.hora_inicio_entrega.value,
    };

    return catalogo;
  }
}
