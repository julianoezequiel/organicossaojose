import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { ListaProdutosDataSource } from "./lista-produtos-datasource";
import { Produto } from "../model/produto.model";
import { ProdutosService } from "../services/produtos.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from "../../confirm-dialog/confirm-dialog.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "lista-produtos",
  templateUrl: "./lista-produtos.component.html",
  styleUrls: ["./lista-produtos.component.css"],
})
export class ListaProdutosComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Produto>;

  dataSource: ListaProdutosDataSource;

  constructor(
    public produtosService: ProdutosService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["descricao", "valor", "unidade", "acoes"];

  ngOnInit() {
   
  }

  ngAfterViewInit() {
    this.dataSource = new ListaProdutosDataSource(this.produtosService);
    this.dataSource.carregarDados().then((data) => {
      this.table.dataSource = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  adicionar() {
    this.router.navigate(["../cadastro-produtos"], {
      relativeTo: this.activatedRoute,
    });
  }

  editar(id) {
    this.router.navigate(["../cadastro-produtos", id], {
      relativeTo: this.activatedRoute,
    });
  }

  confirmDialog(m): void {
    const message = `Deseja excluir o produto?`;

    const dialogData = new ConfirmDialogModel("Confirmar", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult == true) {
        this.excluir(m);
      }
    });
  }

  excluir(m: Produto) {
    if (m._id) {
      this.produtosService.delete(m._id).then(() => {
        this.toastr.success("Produto excluído com sucesso", "Atenção!", {
          closeButton: true,
          progressAnimation: "decreasing",
          progressBar: true,
        });
        this.dataSource.carregarDados().then((data) => {
          this.table.dataSource = data;
        });
      });
    }
  }
}
