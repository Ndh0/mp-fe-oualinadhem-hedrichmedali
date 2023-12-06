import { Component, OnInit } from '@angular/core';
import { Produit } from '../model/produit';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProduitsService } from '../services/produits.service';
import { reponse } from '../model/reponse';

import { ChartConfiguration,Chart,registerables } from 'chart.js';
import { client } from '../model/client';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent  implements OnInit{
  ///////
  selectedFilter: string = '';
  clients:any;
  totFact:any;
  totPay:any;
  d:any[];
  totPays:number;
  totDets:number;
  chart:any = [];
  chart1:any = [];
  filteredClts: any[] = []; 
  applyFilter(selectedFilter: string) {
    
    if (selectedFilter === 'payed') {
      this.filteredClts = this.r.clts.filter(rep => rep.totD === 0);
    } else if (selectedFilter === 'Pending') {
      this.filteredClts = this.r.clts.filter(rep => rep.totD !== 0 && rep.totD<rep.totFactClt);
    } else if(selectedFilter == "not payed") {
      this.filteredClts = this.r.clts.filter(rep => rep.totD == rep.totFactClt);
       // If no filter selected, show all
    }else{
      
      this.filteredClts = this.r.clts;
    }
    
    this.updateChart();
  }
  updateChart() {
    if (this.selectedFilter === 'payed' || this.selectedFilter === 'Pending' || this.selectedFilter === 'not payed') {
      // Filtered data exists
      const filteredTotFact: number[] = [];
      const filteredTotPay: number[] = [];
      const filteredClients: string[] = [];
  
      // Re-generate chart data arrays based on this.filteredClts
      this.filteredClts.forEach(rep => {
        filteredTotFact.push(rep.totFactClt);
        filteredTotPay.push(rep.totPayClt);
        filteredClients.push(rep.np);
      });
  
      // Update the chart data
      if (this.chart) {
        this.chart.data.labels = filteredClients;
        this.chart.data.datasets[0].data = filteredTotFact;
        this.chart.data.datasets[1].data = filteredTotPay;
        this.chart.update(); // Update the chart
      }
  
      // Update other chart (chart1) similarly if needed
      // Example:
      /*
      if (this.chart1) {
        // Update chart1 data using filtered data
        // Ensure correct dataset indexing and labels for chart1
        // Example:
        this.chart1.data.labels = filteredClients;
        this.chart1.data.datasets[0].data = filteredTotFact;
        // ... Update other datasets for chart1 if present
        this.chart1.update(); // Update chart1
      }
      */
    } else {
      // No filter applied (selectedFilter is 'all' or empty)
      // Use the original data without filtering
      if (this.chart) {
        this.chart.data.labels = this.clients;
        this.chart.data.datasets[0].data = this.totFact;
        this.chart.data.datasets[1].data = this.totPay;
        this.chart.update(); // Update the chart
      }
  
      // Update other chart (chart1) similarly if needed
      // Example:
      /*
      if (this.chart1) {
        // Update chart1 data using original data without filtering
        // Ensure correct dataset indexing and labels for chart1
        // Example:
        this.chart1.data.labels = this.clients;
        this.chart1.data.datasets[0].data = this.totFact;
        // ... Update other datasets for chart1 if present
        this.chart1.update(); // Update chart1
      }
      */
    }
  }
  


  /////////

  produits: Array<Produit> = [];
  
  produitCourant=new Produit();
  r=new reponse();
 
  modeEdition:boolean=false;
  


  constructor(private produitsService :ProduitsService,private http: HttpClient)
  {
    Chart.register(...registerables);
    Chart.register(...registerables);
  }

 ngOnInit(): void {
    //Message affiché au moment de l'affichage du composant
    console.log("Initialisation du composant:.....");
    
    //charger les données
    this.getMessage();
    
       
  }
  getMessage(){
    this.produitsService.getMessage()
    .subscribe(
      {
        //En cas de succès
        next: data=> {
          console.log("Succès GET");
          this.r=data;
          this.totFact = this.r.clts.map((clts:client)=> clts.totFactClt);
          this.totPay = this.r.clts.map((clts:client)=> clts.totPayClt);
          this.clients= this.r.clts.map((clts:client)=> clts.np);
          this.totPays = this.r.totpays;
          this.totDets = this.r.totDe;
          this.d=[ this.totPays,this.totDets]
          console.log(this.totFact,this.totPay);
          this.chart1=new Chart(
            'canvas1',{
              type:'doughnut',
              data:{
                labels: ['payements', 'dettes'],
                datasets:[{
                  data: this.d,
                  backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                  ],
                }
                  
                ],
                
              }
            }
          );
          this.chart=new Chart(
            'canvas',{
              type:'bar',
              data :{
                labels:this.clients,
                datasets:[
                  {
                    label:'facture',
                    data: this.totFact,
                  },
                  {
                    label:'payment',
                    data: this.totPay,
                  },
                ],
              },
              
            });
        },

        //En cas d'erreur
        error: err=> {
          console.log("Erreur GET");
          console.log(err);
        }
      }
    )
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

   

    
   supprimerProduit(p: Produit)
   {
    //Afficher une boite de dialogue pour confirmer la suppression
     let reponse:boolean =confirm("Voulez vous supprimer le produit :"+p.designation+" ?");
     if (reponse==true)
     {
        console.log("Suppression confirmée..." );
        //chercher l'indice du produit à supprimer  
        let index: number = this.produits.indexOf(p);
        console.log("indice du produit à supprimer: "+index);
        if (index !== -1) 
        {

          //supprimer dans le BackEnd  
          this.produitsService.deleteProduit(p.id)
          .subscribe(
            {
              next: deletedProduit => {
                console.log("Succès DELETE");
                // Supprimer dans la partie Front End  (dans le tableau produits)
                this.produits.splice(index, 1);
                console.log("Suppressio du produit:"+p.designation);            
              },
              error: err=> {
                console.log("Erreur DELETE");
              }
            }
            )     
          
        }
     }
     else
     {
      console.log("Suppression annulée..." );     
     } 
  }

  editerProduit(p: Produit)
  {
     this.produitCourant.id=p.id;
     this.produitCourant.designation=p.designation;
     this.produitCourant.prix=p.prix;
     this.modeEdition=true;
 }
  validerFormulaire(form: NgForm) 
  {
    console.log(form.value);

      //flag pour distinguer entre le mode AJOUT et le mode EDIT
      let nouveau:boolean=true;
      let index=0;
      do{
       let p=this.produits[index];
        console.log(
             p.designation + ': ' +
            p.prix);
  
            if (p.id==form.value.id)
            {
              //rendre le mode à EDIT
              nouveau=false;
              console.log('ancien');
              
              let reponse:boolean =confirm("Produit existant. Confirmez vous la mise à jour de :"+p.designation+" ?");
              if (reponse==true)
                {
                    this.mettreAJourProduit(form.value , p);
                    this.modeEdition=false;                                   
                }
                else
                {
                  console.log("Mise à jour annulée");
                }              
              
              //Arrêter la boucle
              return;
            }
            else{
              //continuer à boucler
              index++;
            }           
      }
      while(nouveau && index<this.produits.length);
  }
    
   mettreAJourProduit(nouveau: Produit, ancien:Produit) {
    //mettre à jour dans le BackEnd  
    this.produitsService.updateProduit(ancien.id,nouveau)
    .subscribe(
      {
        next: produitModifie=> {
          console.log("Succès PUT");
          //mettre à jour le produit aussi dans le tableau "produits" (FrontEnd)
          ancien.designation=nouveau.designation;
          ancien.prix=nouveau.prix;
            console.log('Mise à jour du produit:'+ancien.designation);
        },
        error: err=> {
          console.log("Erreur PUT");
        }
      }
      )    
 }
 
///////////////////////////////////////////////////////////////////////////


// Usage example



}
