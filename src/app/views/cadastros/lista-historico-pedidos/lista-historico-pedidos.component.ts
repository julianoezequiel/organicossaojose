import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ListaHistoricoPedidosDataSource, ListaHistoricoPedidosItem } from './lista-historico-pedidos-datasource';

@Component({
  selector: 'lista-historico-pedidos',
  templateUrl: './lista-historico-pedidos.component.html',
  styleUrls: ['./lista-historico-pedidos.component.css']
})
export class ListaHistoricoPedidosComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ListaHistoricoPedidosItem>;
  dataSource: ListaHistoricoPedidosDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngOnInit() {
    this.dataSource = new ListaHistoricoPedidosDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
