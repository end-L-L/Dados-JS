import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registro-screen',
  templateUrl: './registro-screen.component.html',
  styleUrls: ['./registro-screen.component.scss']
})
export class RegistroScreenComponent implements OnInit{

  constructor(
    private location: Location
  ) {}

  ngOnInit(): void {
    
  }

    //Propiedades
    public user: any = {};
    public idUser: Number=0;
    //Contraseñas
    public hide_1: boolean = false;
    public hide_2: boolean = false;
    public inputType_1: string = 'password';
    public inputType_2: string = 'password';
    //Errores
    public errors:any ={};

      //Funciones para Password
  showPassword()
  {
    if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar()
  {
    if(this.inputType_2 == 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

    //Función para Detectar el Cambio de Fecha
    public changeFecha(event :any){
      console.log(event);
      console.log(event.value.toISOString());
      
      this.user.fecha_nacimiento = event.value.toISOString().split("T")[0];
      console.log("Fecha: ", this.user.fecha_nacimiento);
    }

  regresar(){
    this.location.back();
  }

  registrar(){}
}
