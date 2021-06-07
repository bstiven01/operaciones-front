import { Component } from '@angular/core';
import { GeneralUtil } from 'src/utils/general.util';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Proyecto';
  loginstatus = GeneralUtil.LOGIN_STATUS;

  constructor(private permissionsService: NgxPermissionsService){}

  /*
  ngOnInit(): void {
    if(GeneralUtil.USER_INFO != null)
    {
      const perm = [];
      perm.push(GeneralUtil.USER_INFO['rol'])
      this.permissionsService.loadPermissions(perm);
    }
  }
  */
  
}
