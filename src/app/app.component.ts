import { Component } from '@angular/core';
import { Produit } from './model/produit';
import { ChartConfiguration } from 'chart.js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

//////
  actions:Array<any> =
  [
    {  titre:"Accueil", route:"/accueil"},
    {  titre:"Liste des produits", route:"/produits"},
    {  titre:"Ajouter Produit", route:"/ajouterProduit"}
  ]

  actionCourante:any;

  setActionCourante(a :any)
  {
    this.actionCourante=a;  
  }  
}
