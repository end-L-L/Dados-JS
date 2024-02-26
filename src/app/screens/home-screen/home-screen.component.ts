import { Component, OnInit } from '@angular/core';
import { FacadeService } from 'src/app/services/facade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss']
})
export class HomeScreenComponent implements OnInit{
  
  // Session Properties
  public token: string = "";

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
    private router: Router
  ) { }

  ngOnInit(): void {

    // Session Initialization
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    
    if(this.token == ""){
      this.router.navigate([""]);
    }  

    // Game Initialization
    this.updateDifficulty();
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

  checkWin(score: number, scoreNeeded: number): void {
    if (score === scoreNeeded) {
      alert('¡Ganaste!');
    } else {
      alert('Intenta de nuevo.');
    }
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
