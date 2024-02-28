import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  // Funciones para Validar

  // Campo Requerido
  required(input:any){
    return (input != undefined && input != null && input != "" && input.toString().trim().length > 0);
  }

  // Validar Email
  email(input:any){
    var regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return input.match(regEx); // Invalid format
  }

  // Validar Fecha
  date(input:any){
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!input.match(regEx)) return false;  // Invalid format
    var d = new Date(input);
    if(Number.isNaN(d.getTime())) return false; // Invalid date
    return d.toISOString().slice(0,10) === input;
  }

  // Validar Fecha
  dateBetween(input:any, min:any, max:any){

    input = new Date(input).getTime();
    min = new Date(min).getTime();
    max = new Date(max).getTime();

    return  (max >= input && input  >= min);

  }

  // Validar Longitud
  max(input:any, size:any){
    return (input.length <= size);
  }
}
