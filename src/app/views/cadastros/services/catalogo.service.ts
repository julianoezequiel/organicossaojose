import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Produto } from "../model/produto.model";
import { Catalogo } from "../model/catalogo.model";

@Injectable({
  providedIn: "root",
})
export class CatalogoService {
  constructor(private firestore: AngularFirestore) {
    
  }

  collectionName = "catalogo";


  create(record: Catalogo) {
    console.log(record);
    return this.firestore.collection(this.collectionName).add(record);
  }

  update(recordID, record: Catalogo) {
    return this.firestore
      .collection(this.collectionName)
      .doc(recordID)
      .update(record);
  }

  read(recordID): AngularFirestoreDocument<Catalogo> {
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

  listar(): Promise<Catalogo[]> {
    return new Promise<Catalogo[]>((acept, reject) => {
      this.read_all().subscribe((data) => {
        let lista: Catalogo[] = data.map((e) => {
          return {
            _id: e.payload.doc.id,
            produtos: e.payload.doc.data()["produtos"],
            data_entrega: e.payload.doc.data()["data_entrega"],
            dia_confirmar: e.payload.doc.data()["dia_confirmar"],
            hora_confirmar: e.payload.doc.data()["hora_confirmar"],
            hora_inicio_entrega: e.payload.doc.data()["hora_inicio_entrega"],
          };
        });
        acept(lista);
      });
    });
  }
}
