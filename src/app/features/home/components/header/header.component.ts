import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SessionService } from 'src/app/core/services/session.service';
import { Session } from 'src/app/core/models/session';
import { PopoverModule } from 'primeng/popover';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import {
    SocialAuthServiceConfig,
    SocialAuthService,
    GoogleLoginProvider,
  } from "@abacritt/angularx-social-login";
import { MenuService } from 'src/app/core/services/menu.service';
import { MenuItemResponse } from 'src/app/core/models/menu-item-response';
import { MemberDetailsComponent } from '../member-details/member-details.component';
import { LogoComponent } from "../../../../shared/components/logo/logo.component";

@Component({
  selector: 'app-header',
  imports: [
    AvatarModule,
    BadgeModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    CommonModule,
    DividerModule,
    FloatLabelModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    Menubar,
    MemberCardComponent,
    MemberDetailsComponent,
    PopoverModule,
    Ripple,
    RouterModule,
    LogoComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [
      SocialAuthService,
      {
        provide: 'SocialAuthServiceConfig',
        useValue: {
          autoLogin: false,
          providers: [
            {
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider('654581949282-dmvkqbivaa8rmvem7ipjbas30p5akkrm.apps.googleusercontent.com', {
                scopes: 'openid profile email',
              }),
            },
          ],
          onError: (err) => {
            console.error(err);
          },
        } as SocialAuthServiceConfig,
      }
    ],
})
export class HeaderComponent implements OnInit{

  availableItems: MenuItem [] = [];
  items: MenuItem[] | undefined;
  menuItemResponses: MenuItemResponse[] = [];

  profilePicUrl = 'assets/blank-profile-picture.jpg';
  session: Session | null = null;

  constructor(
      private alertService: AlertService,
      private authenticationService: AuthenticationService,
      private menuService: MenuService,
      private router: Router,
      private sessionService: SessionService,
      private socialAuthService: SocialAuthService
  ) {

  }

  ngOnInit() {
      this.session = this.sessionService.getSession();
      if(this.session?.member.profilePicUrl) {
        this.profilePicUrl = `${this.session?.member.profilePicUrl }?v=${new Date().getTime()}`;
      }
      this.availableItems = [
        {
            label: 'Explore',
            icon: 'pi pi-search-plus',
            route: '/home/explore',
            command: () => this.removeCreateOrganization()
        },
        {
            label: 'My Organization',
            icon: 'pi pi-sitemap',
            route: '/home/my-organization',
            command: () => this.removeCreateOrganization()
        },
        {
          label: 'Events',
          icon: 'pi pi-calendar',
          route: '/home/my-events',
          command: () => this.removeCreateOrganization()
        },
        {
          label: 'Management',
          icon: 'pi pi-cog',
          command: () => this.removeCreateOrganization(),
          items: [
            {
                label: 'Members',
                icon: 'pi pi-user',
                route: '/home/members',
            },
            {
              label: 'Manage Events',
              icon: 'pi pi-calendar',
              route: '/home/manage-events'
            },
            // {
            //     separator: true,
            // },
            // {
            //     label: 'UI Kit',
            //     icon: 'pi pi-pencil',
            //     shortcut: '⌘+U',
            // },
          ],
        }
      ];
      this.getMenus();
  }

  onClickLogout() {
      this.authenticationService.logout().subscribe(
      (res) => {
          this.socialAuthService.signOut();
          this.sessionService.clearSession();
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
          this.alertService.success('/logout', 'Success', 'Succefully logout');
      },
      (err: any) => {
          console.log(err);
      }
      );
  }

  
  goToCreateOrganization() {
      const exists = this.items?.some(item => item.label === 'Create Organization');
      if (!exists) {
          this.items = [...this.items || [], {
              label: 'Create Organization',
              icon: 'pi pi-user',
              route: '/create-organization'
          }];
      }
      this.router.navigate(['/create-organization']);  
  }

  removeCreateOrganization() {
      this.items = this.items?.filter(item => item.label !== 'Create Organization') || [];
  }

  private getMenus() {
    const organizationId = this.sessionService.organizationId;
    this.menuService.getMenus(organizationId).subscribe(
      (res) => {
        console.log(res);
        this.menuItemResponses = res;
        this.setMenuItems();
      },
      (err: any) => {
        this.alertService.error('/login', 'Error', err.error.message);
      }
    );
  }

  private setMenuItems() {
    this.menuItemResponses.forEach(menuItemResponse => {
      const availableItem = this.availableItems.find(item => item.label === menuItemResponse.label);
      
      if (availableItem) {
        this.items = [...(this.items || []), availableItem];
      }
    });
  }
}
