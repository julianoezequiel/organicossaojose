import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-sucesso',
  templateUrl: './pagina-sucesso.component.html',
  styleUrls: ['./pagina-sucesso.component.css']
})
export class PaginaSucessoComponent implements OnInit {

  constructor( private router: Router,) { }

  ngOnInit(): void {
  }

  gotoNovo(){
    this.router.navigate(["pedido"]);
  }

}
