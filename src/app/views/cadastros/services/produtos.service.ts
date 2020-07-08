import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Produto } from "../model/produto.model";

@Injectable({
  providedIn: "root",
})
export class ProdutosService {
  constructor(private firestore: AngularFirestore) {}

  collectionName = "produtos";

  create(record: Produto) {
    console.log(record);
    return this.firestore.collection(this.collectionName).add(record);
  }

  update(recordID, record: Produto) {
    return this.firestore
      .collection(this.collectionName)
      .doc(recordID)
      .update(record);
  }

  read(recordID): AngularFirestoreDocument<Produto> {
    return this.firestore.collection(this.collectionName).doc(recordID);
  }

  read_all() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }
}
