import { Injectable } from '@angular/core';

// Servicio de Validación
import { ValidatorService } from './tools/validator.service';

// Servicio de Errores
import { ErrorsService } from './tools/errors.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
  ) { }

  public esquemaUser(){
    return {
      'name': '',
      'alias': '',
      'born_date': '',
      'email': '',
      'password1': '',
      'password2': ''
    }
  }

  public validateUser(data: any){
    console.log("Validando user... ", data);
    let error: any = [];

    // Validar Nombre
    if(!this.validatorService.required(data["name"])){
      error["name"] = this.errorService.required;
    }

    // Validar Alias
    if(!this.validatorService.required(data["alias"])){
      error["alias"] = this.errorService.required;
    }

    // Validar Fecha de Nacimiento
    if(!this.validatorService.required(data["born_date"])){
      error["born_date"] = this.errorService.required;
    }

    // Validar Email
    if(!this.validatorService.required(data["email"])){
      error["email"] = this.errorService.required;
    }else if(!this.validatorService.max(data["email"], 40)){
      error["email"] = this.errorService.max(40);
    }else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    // Validar Contraseña
    if(!this.validatorService.required(data["password1"])){
      error["password1"] = this.errorService.required;
    }
    if(!this.validatorService.required(data["password2"])){
      error["password2"] = this.errorService.required;
    }
    
    //Return arreglo
    return error;
  }

}
