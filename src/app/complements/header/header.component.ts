import { Component, OnInit } from '@angular/core';
import { GeneralUtil } from 'src/utils/general.util';
import { TokenService } from 'src/seguridad/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private _tokenService: TokenService) { }

  public userinfo: any;
  public sidebar = true;

  ngOnInit() {
    this.userinfo = GeneralUtil.USER_INFO;
  }

  logout() {
    this._tokenService.cerrarSesion();
  }

  showSideBar(): void {
    const x = document.getElementById('accordionSidebar');
    if ( this.sidebar === true) {
      this.sidebar = false;
      x.style.display = 'none';
    } else {
      this.sidebar = true;
      x.style.display = 'block';
    }
    console.log(this.sidebar);
  }

}
