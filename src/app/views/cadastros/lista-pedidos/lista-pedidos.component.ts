import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router, ActivatedRoute } from "@angular/router";
import { PedidosService } from "../services/pedidos.service";
import { Pedido } from "../model/pedido.model";
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Component({
  selector: "lista-pedidos",
  templateUrl: "./lista-pedidos.component.html",
  styleUrls: ["./lista-pedidos.component.css"],
})
export class ListaPedidosComponent implements AfterViewInit, OnInit {
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  dataSource: MatTableDataSource<Pedido>;
   
  data:Pedido[] ;

  constructor(
    private pedidosService: PedidosService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public dialog: MatDialog,
  ) {}

  
  order:boolean = false;
  
  carregando = true;
  semconteudo = false;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["numero_celular", "data_entrega","acoes"];

  async ngOnInit() {  
     await  this.carregarDados();
  }

  ngAfterViewInit() {
   
  }

  async carregarDados() {
    this.carregando = true;
    await this.pedidosService.listar().then((data) => {
      this.carregando = false;
      this.semconteudo = data.length <= 0;
      this.data = data;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.dataSource.sortingDataAccessor = (item, property) => {
        console.log(item)
        switch (property) {
          case 'data_entrega': {
            let d : firebase.firestore.Timestamp;
            d  = item.data as unknown as firebase.firestore.Timestamp;
            return new Date(d.toDate());
          }
          default: return item[property];
        }
      };
      
    });
  }

  

  sortDataSource(id: string){
    this.order = !this.order;
    let ord = 'desc';
    if(this.order){
      ord = 'asc'
    }
    this.dataSource.sort.sort(<MatSortable>({id: id, start: ord}));
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
          this.data = data;
          this.dataSource = new MatTableDataSource(this.data);
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
