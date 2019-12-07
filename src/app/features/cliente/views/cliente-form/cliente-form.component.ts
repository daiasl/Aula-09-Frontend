import { Component, OnInit, Input } from '@angular/core';
import { catchError, takeUntil } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/core/entities/cliente/cliente';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent implements OnInit {  
  private routeParams: any;
  private ngUnsubscribe = new Subject();
  public cliente: Cliente;

  constructor(    
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {   
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params: any) => this.onRouteParamsChange(params));
    this.route.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: any) => this.onRouteDataChange(data));

  } 
  
  public onCancel(){
    // const previousRoute = '/cliente/list';
    // this.router.navigate([previousRoute], { relativeTo: this.route.parent });
    this.goBack();
  }

  public isNew() {
    return this.routeParams.id === undefined;
  }

  private goBack() {
    const previousRoute = '/cliente/list';
    this.router.navigate([previousRoute], { relativeTo: this.route.parent });
  }

  public onRouteDataChange(data: any) {
    const entity = data[0];
    if (data[0]) {
        const value: any = Cliente.fromDto(entity);
        this.cliente = value;
    } else {
        this.cliente = new Cliente();
        // const value: any = Cliente.fromDto({
        //     id: "123",
        //     nome: "João",
        //     dataNascimento:"12/07/2019",
        //     cpf: "12345678900",
        //     creditoHabilitado:"true",
        //     idFoto: "ABC"
        // });
        // this.cliente = value;
    }
  }

  public onRouteParamsChange(params: any) {
    this.routeParams = params;  
  }
  
}
