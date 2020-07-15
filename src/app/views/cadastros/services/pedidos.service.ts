import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Pedido } from "../model/pedido.model";

@Injectable({
  providedIn: "root",
})
export class PedidosService {
  constructor(private firestore: AngularFirestore) {}

  collectionName = "pedidos";

  create(record: Pedido) {
    console.log(record);
    return this.firestore.collection(this.collectionName).add(record);
  }

  update(recordID, record: Pedido) {
    return this.firestore
      .collection(this.collectionName)
      .doc(recordID)
      .update(record);
  }

  read(recordID): AngularFirestoreDocument<Pedido> {
    return this.firestore.collection(this.collectionName).doc(recordID);
  }

  read_all() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  delete(record_id) {
    return this.firestore
      .collection(this.collectionName)
      .doc(record_id)
      .delete();
  }

  listar(): Promise<Pedido[]> {
    return new Promise<Pedido[]>((acept, reject) => {
      this.read_all().subscribe((data) => {
        let lista: Pedido[] = data.map((e) => {
          return {
            _id: e.payload.doc.id,
            data: e.payload.doc.data()["data"],
            dia_entrega: e.payload.doc.data()["dia_entrega"],
            forma_pagamento: e.payload.doc.data()["forma_pagamento"],
            numero_celular: e.payload.doc.data()["numero_celular"],
            pago: e.payload.doc.data()["pago"],
            produto_pedido: e.payload.doc.data()["produto_pedido"],
            status: e.payload.doc.data()["status"],
            total_pedido: e.payload.doc.data()["total_pedido"],
          };
        });
        acept(lista);
      });
    });
  }
}
