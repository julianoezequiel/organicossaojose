import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import {
  ListaPedidosDataSource,
  ListaPedidosItem,
} from "./lista-pedidos-datasource";
import { Router, ActivatedRoute } from "@angular/router";
import { PedidosService } from "../services/pedidos.service";
import { Pedido } from "../model/pedido.model";

@Component({
  selector: "lista-pedidos",
  templateUrl: "./lista-pedidos.component.html",
  styleUrls: ["./lista-pedidos.component.css"],
})
export class ListaPedidosComponent implements AfterViewInit, OnInit {
  constructor(
    private pedidosService: PedidosService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Pedido>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["celular", "catalogo","acoes"];

  ngOnInit() {
    this.carregarDados();
  }

  ngAfterViewInit() {
    
  }

  carregarDados() {
    this.pedidosService.listar().then((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  adicionar() {
    this.router.navigate(["../cadastro-pedidos", ""], {
      relativeTo: this.activatedRoute,
    });
  }

  editar(id) {
    this.router.navigate(["../cadastro-pedidos", id], {
      relativeTo: this.activatedRoute,
    });
  }
}
