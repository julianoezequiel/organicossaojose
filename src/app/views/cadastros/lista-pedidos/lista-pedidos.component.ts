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
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: "lista-pedidos",
  templateUrl: "./lista-pedidos.component.html",
  styleUrls: ["./lista-pedidos.component.css"],
})
export class ListaPedidosComponent implements AfterViewInit, OnInit {
  constructor(
    private pedidosService: PedidosService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public dialog: MatDialog,
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Pedido>;

  carregando = true;
  semconteudo = false;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["celular", "catalogo","acoes"];

  ngOnInit() {
    this.carregando = true;
    this.carregarDados();
  }

  ngAfterViewInit() {
    
  }

  carregarDados() {
    this.pedidosService.listar().then((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.carregando = false;
      this.semconteudo = data.length <= 0;
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

  confirmDialog(m): void {
    const message = `Deseja excluir o pedido?`;

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

  excluir(m: Pedido) {
    if (m._id) {
      this.pedidosService.delete(m._id).then(() => {
        this.toastr.success("Pedido excluído com sucesso", "Atenção!", {
          closeButton: true,
          progressAnimation: "decreasing",
          progressBar: true,
        });
        this.pedidosService.listar().then((data) => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      });
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
