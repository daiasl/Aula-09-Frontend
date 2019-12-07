import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { Cliente } from 'src/app/core/entities/cliente/cliente';
import { ClienteService } from 'src/app/core/entities/cliente/cliente.service';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'field-cliente-form',
  templateUrl: './field-cliente-form.component.html',
  styleUrls: ['./field-cliente-form.component.scss']
})
export class FieldClienteFormComponent implements OnInit {
  public clienteForm: FormGroup;
  private _cliente: Cliente;
  @Input()
  set cliente(cliente: Cliente){
    if (!this.clienteForm){
      this._cliente = cliente;
      return
    }
    this.clienteForm.reset();
    if (cliente && cliente.id)
      this.clienteForm.patchValue(cliente);
   };

   @Output()
   public onCancel: EventEmitter<any> = new EventEmitter();

  constructor(
    private clienteService: ClienteService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
  ) {   
   }

  ngOnInit() {
    this.clienteForm = this.getFormGroup();
    this.clienteForm.patchValue(this._cliente || []);    
    //this.clienteForm.controls.nome.patchValue("João");    
  }

  private getFormGroup() {
    return this.formBuilder.group({
      id: new FormControl(undefined, Validators.compose([Validators.required])),
      nome: new FormControl(undefined, Validators.compose([Validators.required, this.forbbidenNameValidator(/maria/i)])),
      dataNascimento: new FormControl(undefined, Validators.compose([Validators.required])),
      creditoHabilitado: new FormControl("true", Validators.compose([Validators.required])),
      cpf: new FormControl(undefined, Validators.compose([Validators.required])),
    });
  }
  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsDirty({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFormFields(control);
        }
    });
  }
  
  public onSave() {
    if (!this.clienteForm.valid) {
      return this.validateAllFormFields(this.clienteForm);
    }

    this.getSaveObservable()
    .pipe(
      catchError((err: any) => {
      console.log(err);
      return throwError(err);
    })
    ).subscribe(() => {
      this.messageService.add({
        key: 'form-toast',
        severity: 'success',
        summary: `Sucesso!`,
        detail: `O cliente foi inserido com sucesso!`
      });
      this.onCancel.emit();      
    });
  }

  //requisição encapsulada em uma variável
  private getSaveObservable() {
    const { value } = this.clienteForm;
    const clienteDto = Cliente.toDto(value);
    if (clienteDto && clienteDto.id) {
        return this.clienteService.insert(clienteDto);        
    } else {        
        return this.clienteService.update(clienteDto.id, clienteDto);
    }    
  }

  public forbbidenNameValidator(nameRe: RegExp): ValidatorFn{
    return (control: AbstractControl): {[key: string]: any} | null=>{
      const forbidden= nameRe.test(control.value);
      return forbidden ? { forbidden: {value:control.value}}: null;
    }
    
  }

}
