import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produit } from '../model/produit';
import { Observable } from 'rxjs';
import { reponse } from '../model/reponse';

@Injectable({
  providedIn: 'root'
})
export class ProduitsService {
  
  // Url du service web de gestion de produits
  // commune pour toutes les méthodes
  urlHote="http://localhost:7777/statistiques/getAllFactsClt";

  constructor(private http :HttpClient)
  {

  }

  getProduits() :Observable<Array<Produit>>
  {
    return  this.http.get<Array<Produit>> (this.urlHote,{
      headers: {'Access-Control-Allow-Origin': '*','Accept':'application/json'}
   });
  }
  getMessage() :Observable<reponse>
  {
    return  this.http.get<reponse> (this.urlHote,{
      headers: {'Access-Control-Allow-Origin': '*','Accept':'application/json'}});
  }
  
  deleteProduit(idP: number|undefined)
  {
    return this.http.get (this.urlHote+"delete/"+idP);
  }

  addProduit(nouveau: Produit) {
    return this.http.post<Array<Produit>> (this.urlHote,nouveau);
  }

  updateProduit(idP: number | undefined, nouveau: Produit) {
    return this.http.put(this.urlHote,nouveau);
  }

}
