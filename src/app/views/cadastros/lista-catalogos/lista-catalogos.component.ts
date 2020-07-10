import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-lista-catalogos',
  templateUrl: './lista-catalogos.component.html',
  styleUrls: ['./lista-catalogos.component.css']
})
export class ListaCatalogosComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Catalogo>;

  dataSource: ListaCatalogoDataSource;

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
