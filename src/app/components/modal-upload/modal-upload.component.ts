import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SubirArchivoService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/services/service.index';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir:File;
  imagenTemp:any;

  constructor( 
    public subirArchivoService:SubirArchivoService,
    public modalUploadService:ModalUploadService
    ) {
    
   }

  ngOnInit() {
  }

  cerrarModal(){
    this.imagenTemp = null;
    this.imagenSubir = null;
    
    this.modalUploadService.ocultarModal();
  }

  seleccionImagen( archivo:File ){
    
    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      Swal.fire({
        title: 'Solo imagenes',
        text: 'El archivo seleccionado no es una imagen',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    this.imagenSubir = archivo;
    
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = reader.result;

  }
  
  subirImagen(){
    this.subirArchivoService.subirArchivo( this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id )
         .then( resp =>{
            
          console.log(resp);
          this.modalUploadService.notificacion.emit(resp);
          this.cerrarModal();

         }).catch( resp => {
           console.log('Error en la carga...');
         });
  }

}
