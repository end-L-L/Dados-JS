import { Component, OnInit } from '@angular/core';
import { FacadeService } from 'src/app/services/facade.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

// Modal
import { MatDialog } from '@angular/material/dialog';
import { ActionModalComponent } from 'src/app/modals/action-modal/action-modal.component';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss']
})
export class HomeScreenComponent implements OnInit{
  
  // Session Properties
  public token: string = "";
  public id: any = "";
  public dataRecord: any = {};
  public record_user: any = {};

  // Game Properties
  public currentScore: number = 0; // Almacena la puntuación actual, inicializada en 0.
  public scoreNeeded: number = 6; // Indica la puntuación necesaria para ganar, inicializada en 6.
  public difficulty: string = 'novato'; // Indica el nivel de dificultad actual, inicializado como 'novato'.
  public diceRolls: number[] = []; // Almacena los resultados de los últimos lanzamientos de dados en un arreglo vacío.
  public flag: number = 1; // Indica si el usuario ganó o perdió, inicializado en 1.
  public aux: number = 0;  // Contador de oportunidades (max 3)
  public difficultySelected: boolean = false; // Bandera para apagar el boton de seleccionar dificultad.
  public rollDiceButton: boolean = false; // Bandera para apagar el boton de lanzar dados.

  public alias: string = "";

  difficultySettings = {
    novato:  {dice: 1, scoreNeeded: 6},
    normal:  {dice: 2, scoreNeeded: 7},
    experto: {dice: 3, scoreNeeded: 15}
  };

  constructor(
    private facadeService: FacadeService,
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    // Session Initialization
    this.token = this.facadeService.getSessionToken();
    
    // ID Initialization
    this.id = this.facadeService.getUserId();

    // Alias Initialization
    this.alias = this.facadeService.getUserAlias();

    // No Token, Login.
    if(this.token == ""){
      this.router.navigate([""]);
    }

    // Game Initialization
    this.updateDifficulty();

    // Record Initialization
    this.obtenerRecord();
  }

  rollDice(): void {
    if(this.aux === 0)
      this.difficultySelected = true; // Activa el boton de seleccionar dificultad.

    let {dice, scoreNeeded} = this.difficultySettings[this.difficulty]; // Obtiene los valores de dice y scoreNeeded de la configuración de dificultad actual.
    this.diceRolls = []; // Resetea el arreglo diceRolls.
    let totalScore = 0;

    for (let i = 0; i < dice; i++) {
      let roll = Math.floor(Math.random() * 6) + 1;
      totalScore += roll;
      this.diceRolls.push(roll);
    }

    this.currentScore = totalScore;
    this.checkWin(totalScore, scoreNeeded);
  }

  updateDifficulty(): void {
    let {scoreNeeded} = this.difficultySettings[this.difficulty];
    this.scoreNeeded = scoreNeeded;
    this.currentScore = 0;
  }


  checkWin(score: number, scoreNeeded: number): void {
  if (score === scoreNeeded) {
    this.flag = 1;
  } else {
    this.flag = 0;
  } 
    this.aux++;
    // O gana antes de la tercera oportunidad o pierde.
    if( this.flag != 0 || this.aux === 3 ){
      this.rollDiceButton = true; // Apaga el boton de lanzar dados.
      this.aux = 0; // Resetea el contador de oportunidades.
      this.dataRecord = {
        result: this.flag,
        level: this.difficultySettings[this.difficulty].dice,
        id: this.id
      }
      this.apiService.actualizarRecord(this.dataRecord).subscribe({
        next: (response) => {
          //console.log("Record Actualizado: ", response);
        },
        error: (error) => {
          console.error(error);
        }
      });

      setTimeout(() => {
        // Modal
        const dialogRef = this.dialog.open(ActionModalComponent, {
          data: {resultado: this.flag},
        });
        this.difficultySelected = false;
        this.rollDiceButton = false;
        this.currentScore = 0;
        this.diceRolls = [];
      }, 1000);     
    }

  }
  
  public obtenerRecord(){
    this.apiService.obtenerRecord().subscribe({
      next: (response) => {
        //console.log("Record: ", response);
        this.record_user = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  logOut() {
    this.facadeService.logOut().subscribe({
      next: (response) => {
        this.facadeService.destroyUser();
        //Navega al login
        this.router.navigate(["/"]);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
