import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from 'src/app/services/service.index';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios:Usuario[] = [];
  desde:number = 0;
  totalRegistro:number = 0;
  cargando:boolean = true;

  constructor(
     public usuarioService:UsuarioService,
     public modalUploadService:ModalUploadService
     ) { }

  ngOnInit() {
    this.cargarUsuarios();
    
    this.modalUploadService.notificacion.subscribe( resp => this.cargarUsuarios());

  }

  cargarUsuarios(){
    this.cargando = true;

    this.usuarioService.cargarUsuarios( this.desde ).subscribe( (resp:any) =>{
      this.totalRegistro = resp.total;
      this.usuarios = resp.usuarios;

      this.cargando = false;
    });
  }

  cambiarDesde(valor:number){
    let desde = this.desde + valor;

    if (desde >= this.totalRegistro) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }

  buscarUsuario( termino:string ){
    
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.usuarioService.buscarUsuarios(termino).subscribe((usuarios:Usuario[]) => {
      this.usuarios = usuarios;
      this.cargando = false;
    });
  }

  borrarUsuario(usuario:Usuario){
    if (usuario._id === this.usuarioService.usuario._id) {
      Swal.fire({
        title: 'No puede borrar Usuario',
        text: 'No se puede borrar a si mismo',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    Swal.fire({
      title: 'Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo!'
    }).then((borrar) => {
      if (borrar.value) {
        this.usuarioService.borrarUsuario( usuario._id ).subscribe( resp => {
          this.cargarUsuarios();
        });        
        Swal.fire(
          'Deleted!',
          'El usuario ha sido eliminado correctamente',
          'success'
        )
      }
    })
  }

  guardarUsuario( usuario:Usuario ){
    this.usuarioService.actualizarUsuario( usuario ).subscribe();
  }

  mostrarModal( id:string ){
    this.modalUploadService.mostrarModal('usuarios', id);
  }

}
