import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ListaPedidosDataSource, ListaPedidosItem } from './lista-pedidos-datasource';
import { PedidosService } from './pedidos.service';

@Component({
  selector: 'lista-pedidos',
  templateUrl: './lista-pedidos.component.html',
  styleUrls: ['./lista-pedidos.component.css']
})
export class ListaPedidosComponent implements AfterViewInit, OnInit {

  constructor(private pedidosService:PedidosService){

  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ListaPedidosItem>;
  dataSource: ListaPedidosDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngOnInit() {
    this.dataSource = new ListaPedidosDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  carregarDados(){
  //   this.pedidosService.read_todos().subscribe((data) => {
  //     this.dataSource = data.map((e) => {
  //       return {
  //           _id: e.payload.doc.id,
  //           isEdit: false,
  //           descricao: e.payload.doc.data()["descricao"],
  //           metrica: e.payload.doc.data()["metrica"],
  //           quantidade: e.payload.doc.data()["quantidade"],
  //           valor_entrada:e.payload.doc.data()["valor_entrada"],
  //           valor_saida:e.payload.doc.data()["valor_saida"]

  //       };
  //     })
  // }
}
}
