import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/core/entities/cliente/cliente.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Cliente } from 'src/app/core/entities/cliente/cliente';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss']
})
export class ClienteListComponent implements OnInit {

  clientes: Cliente[];
  columns: any[];
  display: boolean = false;
  cliente: Cliente;
      
  constructor(
    private clienteService: ClienteService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.clienteService.list()
    .pipe(this.listErrorCatch())
    .subscribe(({ contents }) => {
      //this.clientes = Cliente.fromDto(Cliente.toDto(contents));
      this.clientes = contents
    });

    this.columns = this.getGridColumns();

  }

  private getGridColumns() {
    const gridcolumns = [
      { field: 'nome', header: 'Nome' },
      { field: 'dataNascimento', header: 'Data de Nascimento' },
      { field: 'creditoHabilitado', header: 'Credito Habilitado' },
      { field: 'cpf', header: 'CPF' },
      { field: 'Botões', header: 'Botões'}
    ];

    return gridcolumns;
  }

  public onRemove(item: Cliente) {
    this.messageService.add({
      key: 'removeConfirm',
      data: item, sticky: true,
      severity: 'info',
      summary: 'Voce tem certeza?',
      detail: 'Confirme para DELETAR'
    });
  }

  public onAdd() {
    this.router.navigate(['/cliente/create'], { relativeTo: this.route });
  }
  // public onEdit(){        
  //   const value: any = Cliente.fromDto({
  //     id: "123",
  //     nome: "João",
  //     dataNascimento:"12/07/2019",
  //     cpf: "12345678900",
  //     creditoHabilitado:"true",
  //     idFoto: "ABC"
  //   });
  //   this.cliente = value;
  //   this.display = true;

  // }
  

  public editItem(cliente: Cliente) {
    this.cliente = Cliente.fromDto(cliente);
    this.display=true;
    //this.router.navigate([`/cliente/edit/${cliente.id}`], { relativeTo: this.route });
  }

  public onRemoveConfirm(item: any) {
    const { id, nome } = item.data;

    this.clienteService.delete(id).subscribe(() => {
      this.messageService.clear('removeConfirm');
      this.clientes = this.clientes.filter(cliente => cliente.id !== id);
      this.clientes.find((cliente: Cliente) => cliente.id === id);
      this.messageService.add({
        key: 'remove-toast',
        severity: 'success',
        summary: `Sucesso!`,
        detail: `Cliente ${nome} deletado!`
      });
    });
  }

  public onRemoveReject() {
    this.messageService.clear('removeConfirm');
  }

  private listErrorCatch() {
      return catchError((err: any) => {
        if (err) {
          this.messageService.add({
            key: 'remove-toast',
            severity: 'error',
            summary: 'Erro!',
            detail: `Erro ao carregar a lista!`
          });
        }
        return throwError(err);
      });
  }

  public onCancel(){
    this.display = false;
  }

}
