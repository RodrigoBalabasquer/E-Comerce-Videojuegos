import { Component, OnInit } from '@angular/core';
import { JuegoService } from '../../servicios/juego.service';
import { Router} from '@angular/router';
import { MatDialog,MatDialogConfig } from "@angular/material/dialog";

import { LoginComponent } from '../login/login.component';
import { RegistroComponent } from '../registro/registro.component';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  public juegos: any[];
  public formato: string = "";
  public genero: string = "";
  public plataforma: string = "";
  public orden: string = "";
  public titulo: string = "";
  constructor(public JuegoService : JuegoService, public dialog: MatDialog,public router:Router) { }

  ngOnInit() {
    this.buscar();
  }

  buscar(){
    this.JuegoService.listarJuegosPromesa(this.plataforma,this.genero,this.formato,this.titulo,this.orden).then(
      (datos) => {
        this.juegos = datos;
      }
    );
  }

  Ir(id:string){
    this.router.navigateByUrl("Juego/"+id);
  }

  AbrirModal(event: any) {
    if(event == 1){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = "Registro de usuario";
      
      
      const dialogRef = this.dialog.open(RegistroComponent, dialogConfig);
      
      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
      })
    }
    if(event == 2){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = "Inicio de sesion";
      
      
      const dialogRef = this.dialog.open(LoginComponent, dialogConfig);
      
      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
      })
    }
  }

}
