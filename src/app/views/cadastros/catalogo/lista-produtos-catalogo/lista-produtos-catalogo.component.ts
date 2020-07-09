import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Produto } from '../../model/produto.model';

@Component({
  selector: 'app-lista-produtos-catalogo',
  templateUrl: './lista-produtos-catalogo.component.html',
  styleUrls: ['./lista-produtos-catalogo.component.css']
})
export class ListaProdutosCatalogoComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<ListaProdutosCatalogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: String[]) { }

  ngOnInit(): void {
  }


  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
 

}
