import {Injectable} from '@angular/core';
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  documentId,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from "@angular/fire/firestore";
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  private readonly coll: CollectionReference<DocumentData>;

  constructor(private database: Firestore) {
    this.coll = collection(this.database, "users");
  }

  async findOne(id: string) {
    return getDoc(doc(this.coll, id))
  }

  public async find(id: string) {
    return await getDocs(query(this.coll, where(documentId(), "==", id)));
  }

  public async findAll() {
    return await getDocs(this.coll);
  }

  public async findAllIds() {
    return await getDocs(this.coll)
      .then(value => value.empty ? [] : value.docs.map(value1 => value1.id));
  }

  public async save(model: User) {
    return await setDoc(doc(this.coll, model.id), model)
  }
}