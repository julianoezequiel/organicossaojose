import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ListaProdutosCatalogoComponent } from './lista-produtos-catalogo/lista-produtos-catalogo.component';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  list:[];
  ngOnInit(): void {
  }

  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];

  openDialog(): void {
    const dialogRef = this.dialog.open(ListaProdutosCatalogoComponent, {
      width: '250px',
      data: this.typesOfShoes
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      alert(JSON.stringify(result));
      this.list = result;
    });
  }
}
