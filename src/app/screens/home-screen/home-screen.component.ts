import { Component, OnInit } from '@angular/core';
import { FacadeService } from 'src/app/services/facade.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

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
  currentScore: number = 0; // Almacena la puntuación actual, inicializada en 0.
  scoreNeeded: number = 6; // Indica la puntuación necesaria para ganar, inicializada en 6.
  difficulty: string = 'novato'; // Indica el nivel de dificultad actual, inicializado como 'novato'.
  diceRolls: number[] = []; // Almacena los resultados de los últimos lanzamientos de dados en un arreglo vacío.

  difficultySettings = {
    novato:  {dice: 1, scoreNeeded: 6},
    normal:  {dice: 2, scoreNeeded: 7},
    experto: {dice: 3, scoreNeeded: 15}
  };

  constructor(
    private facadeService: FacadeService,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {

    // Session Initialization
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    
    // ID Initialization
    this.id = this.facadeService.getUserId();

    if(this.token == ""){
      this.router.navigate([""]);
    }

    // Game Initialization
    this.updateDifficulty();

    // Record Initialization
    this.obtenerRecord();
  }

  rollDice(): void {
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

  flag = 1;

  checkWin(score: number, scoreNeeded: number): void {
  if (score === scoreNeeded) {
    alert('¡Ganaste!');
    this.flag = 1;
  } else {
    alert('Intenta de nuevo.');
    this.flag = 0;
  }
    console.log("Result: ", this.flag);
    console.log("Level: ", this.difficultySettings[this.difficulty].dice);
    console.log("id", this.id);
  
    this.dataRecord = {
      result: this.flag,
      level: this.difficultySettings[this.difficulty].dice,
      id: this.id
    }
    this.apiService.actualizarRecord(this.dataRecord).subscribe({
      next: (response) => {
        console.log("Record Actualizado: ", response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  
  
  public obtenerRecord(){
    this.apiService.obtenerRecord().subscribe({
      next: (response) => {
        console.log("Record: ", response);
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
        console.log("Entró");
        
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
