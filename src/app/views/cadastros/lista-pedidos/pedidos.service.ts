import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private firestore: AngularFirestore) { }

  collectionName = 'pedidos';

  read_todos() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }
}
