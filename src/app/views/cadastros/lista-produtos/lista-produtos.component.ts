import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import {
  ListaProdutosDataSource,
  ListaProdutosItem,
} from "./lista-produtos-datasource";
import { Produto } from "../model/produto.model";
import { ProdutosService } from "../services/produtos.service";
import { Router, ActivatedRoute } from "@angular/router";

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
    private activatedRoute: ActivatedRoute
  ) {}
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["descricao", "valor", "unidade", "acoes"];

  ngOnInit() {
    this.dataSource = new ListaProdutosDataSource(this.produtosService);
    this.dataSource.carregarDados().then((data) => {
      this.table.dataSource = data;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  adicionar() {
    this.router.navigate(["../cadastro-produtos", ""], {
      relativeTo: this.activatedRoute,
    });
  }

  editar(id) {
    this.router.navigate(["../cadastro-produtos", id], {
      relativeTo: this.activatedRoute,
    });
  }
}
