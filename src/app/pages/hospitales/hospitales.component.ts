import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService, ModalUploadService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales:Hospital[] = [];

  constructor(
    public hospitalService:HospitalService,
    public modalUploadService:ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this.modalUploadService.notificacion.subscribe(() => {
      this.cargarHospitales();
    })
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales().subscribe( hospitales => this.hospitales = hospitales);
  }

  buscarHospital(termino:string){

    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.hospitalService.buscarHospital( termino ).subscribe( hospitales => this.hospitales = hospitales );
  }

  guardarHospital( hospital:Hospital ){
    this.hospitalService.guardarHospital(hospital).subscribe();
  }

  borrarHospital( hospital:Hospital ){
    this.hospitalService.borrarHospital(hospital._id).subscribe( () => this.cargarHospitales());
  }

  crearHospital(){
    Swal.fire({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      icon: 'info',
      confirmButtonText: 'Ok',
      showCancelButton: true,
    }).then( (valor:any) => {
      if (!valor.value || valor.value.length === 0) {
        return;
      }
      
      this.hospitalService.crearHospital( valor.value ).subscribe(() => this.cargarHospitales() );


    });
  }

  actualizarImagen(hospital:Hospital){
    this.modalUploadService.mostrarModal( 'hospitales', hospital._id );
  }

}
