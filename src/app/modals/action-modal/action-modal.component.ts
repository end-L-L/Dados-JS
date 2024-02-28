import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FacadeService } from 'src/app/services/facade.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-action-modal',
  templateUrl: './action-modal.component.html',
  styleUrls: ['./action-modal.component.scss']
})
export class ActionModalComponent implements OnInit {
  
  public record_user: any = {};
  public userName: string = "";

  constructor(
    private apiService: ApiService,
    private facadeService: FacadeService,
    private router: Router,
    private dialogRef: MatDialogRef<ActionModalComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any
  ){}
  
  ngOnInit(): void {
    // Record Initialization
    this.obtenerRecord();
    console.log("Data: ", this.data);
    console.log(typeof(this.data.resultado)); 

    // User Name Initialization
    this.userName = this.facadeService.getUserCompleteName().split(" ")[0];
    console.log("User Name: ", this.userName);
  }

  public resultado:number = this.data.resultado;

  public cerrar_modal(){
    this.dialogRef.close();
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
    this.dialogRef.close();
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
