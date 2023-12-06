import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { Produit } from '../model/produit';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-ajout-produit',
  templateUrl: './ajout-produit.component.html',
  styleUrls: ['./ajout-produit.component.css']
})
export class AjoutProduitComponent implements OnInit
{
  produits: Array<Produit> = [];
  nouveauProduit=new Produit();

  constructor(private produitsService :ProduitsService)
  {
  }
  ngOnInit(): void {
    //récupérer la liste des produits existants
    this.consulterProduits();
  }

  consulterProduits() {
    console.log("Récupérer la liste des produits");
    //Appeler la méthode 'getProduits' du service pour récupérer les données du JSON
    this.produitsService.getProduits()
    .subscribe(
      {
        //En cas de succès
        next: data=> {
          console.log("Succès GET");
          this.produits=data;
        },

        //En cas d'erreur
        error: err=> {
          console.log("Erreur GET");
        }
      }
    )    
  }


  validerFormulaire(form: NgForm) 
  {
    console.log(form.value);
    this.ajouterProduit(form.value);
    form.reset();
  }

  ajouterProduit(nouveau: Produit) {
    console.log('nouveau');
      //ajouter dans le BackEnd  
      this.produitsService.addProduit(nouveau)
      .subscribe(
        {
          next: newProduit=> {
            console.log("Succès POST");
            console.log("Ajout d'un nouveau produit:"+nouveau.designation);            
          },
          error: err=> {
            console.log("Erreur POST");
          }
        }
        )    
  }
}
