import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../Services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Usuario } from '../../../../Interfaces/usuario';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

// 🔹 Angular Material imports necesarios
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './modal-usuario.html',
  styleUrl: './modal-usuario.css',
})
export class ModalUsuario implements OnInit {  
  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";

  constructor(
    public modalActual: MatDialogRef<ModalUsuario>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioUsuario = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      idRol: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: ['1', Validators.required]
    });

    if (this.datosUsuario) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  ngOnInit(): void {
    if (this.datosUsuario) {
      this.formularioUsuario.patchValue({
        nombreCompleto: this.datosUsuario.nombre,
        correo: this.datosUsuario.email,
        clave: this.datosUsuario.pwd
      });
    }
  }

  guardarEditar_Usuario() {
    const _usuario: Usuario = {
      id: this.datosUsuario ? this.datosUsuario.id : 0,
      nombre: this.formularioUsuario.value.nombreCompleto,
      email: this.formularioUsuario.value.correo,
      pwd: this.formularioUsuario.value.clave
    };

    const obs = this.datosUsuario
      ? this._usuarioServicio.editar(_usuario)
      : this._usuarioServicio.guardar(_usuario);

    obs.subscribe({
      next: (data) => {
        if (data.status) {
          this._utilidadServicio.mostrarAlerta(
            this.datosUsuario ? "El usuario fue editado" : "El usuario fue registrado",
            "Éxito"
          );
          this.modalActual.close("true");
        } else {
          this._utilidadServicio.mostrarAlerta(
            "No se pudo completar la operación",
            "Error"
          );
        }
      },
      error: () => {}
    });
  }
}