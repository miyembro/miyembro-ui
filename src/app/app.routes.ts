import { Route } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { UnAuthGuard } from './core/guards/unauth-guard';
import { ExplorePageComponent } from './features/explore/pages/explore-page/explore-page.component';
import { MemberPageComponent } from './features/members/pages/member-page/member-page.component';
import { CreateOrganizationPageComponent } from './features/create-organization/pages/create-organization-page/create-organization-page.component';
import { GoogleLoginComponent } from './core/auth/pages/google-login/google-login.component';
import { OrganizationDetailsPageComponent } from './features/organization/pages/organization-details-page/organization-details-page.component';
import { MyOrganizationComponent } from './features/organization/pages/my-organization/my-organization.component';

export const appRoutes: Route[] = [
    {
      path: '',
      redirectTo: 'home/explore',
       pathMatch: 'full',
      //  canActivate: [AuthGuard],
    },
    {
      path: 'home',
      loadComponent: () => import('./features/home/pages/home/home.component').then(mod => mod.HomeComponent),
      children: [
        { path: 'explore', component: ExplorePageComponent },
        { path: 'my-organization', component: MyOrganizationComponent },
        { path: 'members', component: MemberPageComponent },
        { path: 'organization-details/:organizationId', component: OrganizationDetailsPageComponent },

      ],
      canActivate: [AuthGuard],
    },
    {
      path: 'edit-member-details',
      loadComponent: () => import('./features/edit-member-details/pages/edit-member-details-page/edit-member-details-page.component').then(mod => mod.EditMemberDetailsPageComponent),
      canActivate: [AuthGuard],
    },
    {
      path: 'edit-organization-address/:organizationId',
      loadComponent: () => import('./features/organization/pages/edit-organization-address/edit-organization-address.component').then(mod => mod.EditOrganizationAddressComponent),
      canActivate: [AuthGuard],
    },
    {
      path: 'edit-organization-contact-details/:organizationId',
      loadComponent: () => import('./features/organization/pages/edit-organization-contact-details/edit-organization-contact-details.component').then(mod => mod.EditOrganizationContactDetailsComponent),
      canActivate: [AuthGuard],
    },
    {
      path: 'edit-organization-description/:organizationId',
      loadComponent: () => import('./features/organization/pages/edit-organization-description/edit-organization-description.component').then(mod => mod.EditOrganizationDescriptionComponent),
      canActivate: [AuthGuard],
    },
    {
      path: 'create-organization',
      loadComponent: () => import('./features/create-organization/pages/create-organization-page/create-organization-page.component').then(mod => mod.CreateOrganizationPageComponent),
      canActivate: [AuthGuard],
    },
    // {
    //   path: 'organization-details/:organizationId',
    //   loadComponent: () => import('./features/home/pages/organization/pages/organization-details-page/organization-details-page.component').then(mod => mod.OrganizationDetailsPageComponent),
    //   canActivate: [AuthGuard],
    // },
    {
        path: 'login',
        loadComponent: () => import('./core/auth/pages/login/login.component').then(mod => mod.LoginComponent),
        canActivate: [UnAuthGuard],
    },
    {
      path: 'login/callback',
      component: GoogleLoginComponent,
      canActivate: [UnAuthGuard],
  },
    {
      path: 'choose-organization',
      loadComponent: () => import('./core/auth/pages/choose-organization/choose-organization.component').then(mod => mod.ChooseOrganizationComponent),
      canActivate: [UnAuthGuard],

    },
    {
        path: 'register',
        loadComponent: () => import('./core/auth/pages/sign-up/sign-up.component').then(mod => mod.SignUpComponent),
        canActivate: [UnAuthGuard],
    },
    
    {
      path: 'additional-info-signup',
      loadComponent: () => import('./core/auth/pages/additional-info-signup/additional-info-signup.component').then(mod => mod.AdditionalInfoSignupComponent),
      canActivate: [UnAuthGuard],
  },
  //   {
  //     path: 'register',
  //     loadComponent: () => import('./core/auth/pages/sign-up/sign-up.component').then(mod => mod.SignUpComponent),
  //     canActivate: [UnAuthGuard],

  // },
    //  {
    //     path: '',
    //     redirectTo: 'home',
    //     pathMatch: 'full'
    //   },
      {
        path: '**',
        loadComponent: () => import('./core/auth/pages/page-not-found/page-not-found.component')
          .then(mod => mod.PageNotFoundComponent),
          // canActivate: [UnAuthGuard],
      }
];
