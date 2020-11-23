import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { JuegoService } from '../../servicios/juego.service';
import { Juego } from '../../clases/juego';

@Component({
  selector: 'app-alta-juego',
  templateUrl: './alta-juego.component.html',
  styleUrls: ['./alta-juego.component.css']
})
export class AltaJuegoComponent implements OnInit {

  public generos = [];
  public formatos = [];
  public plataformas = [];

  titulo: string;
  descripcion: string;
  precio: number;
  plataforma: number;
  formato: number;
  genero: number;
  stock: number;
  updateFoto: boolean = false;
  
  formErrors = { 
    titulo: "", 
    descripcion: "",
    precio: "",
    plataforma: "",
    formato: "",
    genero: "",
    stock: "",
  };
  validation_messages = {
    titulo: {
      required: "Este campo es requerido",
      minlength: "Ingresá un titulo mayor a 5 caracteres",
    },
    descripcion: {
      required: "Este campo es requerido",
      minlength: "Ingresá una descripción mayor a 10 caracteres",
    },
    precio: {
      required: "Este campo es requerido",
    },
    plataforma: {
      required: "Este campo es requerido",
    },
    formato: {
      required: "Este campo es requerido",
    },
    genero: {
      required: "Este campo es requerido",
    },
    stock: {
      required: "Este campo es requerido",
    },
  };

  public registroForm: FormGroup;
  public files: NgxFileDropEntry[] = [];
  public file: File;
  public nombreFoto1: string = "";
  public datos: any;

  constructor(
    public formBuilder: FormBuilder,
    public juegoService: JuegoService,
    public dialogref: MatDialogRef<AltaJuegoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.juegoService.listarFormatosPromesa()
    .then((datos) => {
        this.formatos = datos;
      })
      .catch(
      (noSeEncontroUsuario) => { alert("Error en el sistema"); }
      );
    this.juegoService.listarGenerosPromesa()
    .then((datos) => {
        this.generos = datos;
      })
      .catch(
      (noSeEncontroUsuario) => { alert("Error en el sistema"); }
      );
    this.juegoService.listarPlataformasPromesa()
    .then((datos) => {
        this.plataformas = datos;
      })
      .catch(
      (noSeEncontroUsuario) => { alert("Error en el sistema"); }
      );
    //this.formatos = [{id:1,valor:"Físico"},{id:2,valor:"Digital"}];
    //this.plataformas = [{id:1,valor:"Xbox One"},{id:2,valor:"PS4"},{id:3,valor:"Switch"}];
    //this.generos = [{id:1,valor:"Shooter"},{id:2,valor:"Plataformas"},{id:3,valor:"RPG"},{id:4,valor:"Carreras"},{id:5,valor:"Peleas"}];
    this.datos = this.data;
    this.registroForm = this.crearForm();
  }

  crearForm(): FormGroup {
    let form = this.formBuilder.group(
      {
        titulo: [this.titulo, [Validators.required,Validators.minLength(5)]],
        descripcion: [this.descripcion, [Validators.required,Validators.minLength(10)]],
        precio: [this.precio, [Validators.required]],
        plataforma: [this.plataforma, [Validators.required]],
        formato: [this.formato, [Validators.required]],
        genero: [this.genero, [Validators.required]],
        stock: [this.stock, [Validators.required]],
      }
    );
    form.valueChanges.subscribe(data => this.onValueChanged(data));
    return form;
  };
  onValueChanged(data?: any) {
    if (!this.registroForm) {
      return;
    }
    const form = this.registroForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = "";
          const control = form.get(field);
          if (control && !control.valid) {
            const messages = this.validation_messages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + " ";
              }
            }
          }
        }
      }
  }

  registrar(){
    if (this.registroForm.invalid) return alert("Complete los campos requeridos");
    if (this.file == null) return alert("Debe ingresar una foto de portada");
    if (this.file.type != "image/png" && this.file.type != "image/jpeg") return alert("El tipo de portada debe ser 'jpg' o 'png'");
    var plataforma = this.plataformas.find(x => x.id == this.plataforma);
    var formato = this.formatos.find(x => x.id == this.formato);
    this.juegoService.verificar(0,this.titulo,plataforma.descripcion,formato.descripcion,this.plataforma,this.formato)
    .then((resultado) => {

        if(!resultado.exito){
          return alert(resultado.mensaje);
        }

        var juego = new Juego(0,this.titulo,this.precio,this.plataforma,this.genero,this.formato,this.stock,"","","","",this.descripcion);
        this.juegoService.RegistrarJuego(juego,this.file)
        .then((datos) => {
          if (datos == true){ 
            alert("Se registro con exito");
            this.dialogref.close();
          }
          else
            alert("No se pudo cargar el juego");
          })
        .catch(
        (noSeEncontroUsuario) => { alert("Error en el sistema"); }
        );
    })
    .catch(
    (noSeEncontroUsuario) => { alert("Error en el sistema"); }
    );
  }
  
  Actualizar(){
    if (this.registroForm.invalid) return alert("Complete los campos requeridos");
    if(this.updateFoto){
      if (this.file == null) return alert("Debe ingresar una foto de portada");
      if (this.file.type != "image/png" && this.file.type != "image/jpeg") return alert("El tipo de portada debe ser 'jpg' o 'png'");
    }
    var plataforma = this.plataformas.find(x => x.id == this.datos.juegoActualizar.plataformaId);
    var formato = this.formatos.find(x => x.id == this.datos.juegoActualizar.formatoId);

    this.juegoService.verificar(this.datos.juegoActualizar.id,this.datos.juegoActualizar.titulo,plataforma.descripcion,formato.descripcion,
    this.datos.juegoActualizar.plataformaId,this.datos.juegoActualizar.formatoId)
    .then((resultado) => {
      if(!resultado.exito){
          return alert(resultado.mensaje);
      }

      var juego = new Juego(this.datos.juegoActualizar.id,this.datos.juegoActualizar.titulo,this.datos.juegoActualizar.precio,
      this.datos.juegoActualizar.plataformaId,this.datos.juegoActualizar.generoId,this.datos.juegoActualizar.formatoId,this.datos.juegoActualizar.stock
      ,"","","",this.datos.juegoActualizar.foto,this.datos.juegoActualizar.descripcion);

      this.juegoService.ActualizarJuego(juego,this.updateFoto,this.file)
      .then((datos) => {
        if (datos == true) 
        {
          alert("Se actualizo con exito");
          this.dialogref.close();
        }
      })
      .catch(
      (noSeEncontroUsuario) => { alert("Error en el sistema"); }
      );
    })
    .catch(
    (noSeEncontroUsuario) => { alert("Error en el sistema"); }
    );
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
 
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.nombreFoto1 = file.name;
          this.file = file;
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }
}
