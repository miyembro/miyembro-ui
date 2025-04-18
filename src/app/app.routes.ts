import { Route } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { UnAuthGuard } from './core/guards/unauth-guard';
import { ExplorePageComponent } from './features/explore/pages/explore-page/explore-page.component';
import { MemberPageComponent } from './features/members/pages/member-page/member-page.component';
import { GoogleLoginComponent } from './core/auth/pages/google-login/google-login.component';
import { OrganizationDetailsPageComponent } from './features/organization/pages/organization-details-page/organization-details-page.component';
import { MyOrganizationComponent } from './features/organization/pages/my-organization/my-organization.component';
import { EventDetailsPageComponent } from './features/event/pages/event-details/event-details-page.component';
import { ManageEventsComponent } from './features/event/pages/manage-events/manage-events.component';
import { EventDetailsDrawerComponent } from './features/event/pages/event-details-drawer/event-details-drawer.component';
import { EventEditDrawerComponent } from './features/event/pages/event-edit-drawer/event-edit-drawer.component';
import { EventCreateDrawerComponent } from './features/event/pages/event-create-drawer/event-create-drawer.component';
import { MyEventsPageComponent } from './features/my-events/pages/my-events-page/my-events-page.component';
import { EventAttendanceListPageComponent } from './features/event/pages/event-attendance-list-page/event-attendance-list-page.component';

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
        {
          path: 'manage-events',
          component: ManageEventsComponent,
          children: [
            {
              path: 'active', 
              loadComponent: () => import('./features/event/pages/active-events-list/active-events-list.component')
                .then(c => c.ActiveEventsListComponent),
              children: [
                { path: 'view/:eventId', component: EventDetailsDrawerComponent },
                { path: 'edit/:eventId', component: EventEditDrawerComponent } ,
                { path: 'create/:organizationId', component: EventCreateDrawerComponent },
              ]
            },
            { 
              path: 'old', 
              loadComponent: () => import('./features/event/pages/old-events-list/old-events-list.component').then(c => c.OldEventsListComponent) 
            },
            { path: '', redirectTo: 'active', pathMatch: 'full' }
          ]
        },
        { path: 'organization-details/:organizationId', component: OrganizationDetailsPageComponent },
        { 
          path: 'event-details', 
          component: EventDetailsPageComponent,
        },
        { path: 'my-events', component: MyEventsPageComponent },
        { path: 'event-attendance-list/:eventId/:organizationId', component: EventAttendanceListPageComponent }
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
    {
      path: 'create-event',
      loadComponent: () => import('./features/event/pages/create-event-page/create-event-page.component').then(mod => mod.CreateEventPageComponent),
      canActivate: [AuthGuard],
    },
    {
      path: 'edit-event',
      loadComponent: () => import('./features/event/pages/edit-event-page/edit-event-page.component').then(mod => mod.EditEventPageComponent),
      canActivate: [AuthGuard],
    },
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
      path: 'register-email-confirmation/:memberId',
      loadComponent: () => import('./features/confirmation/pages/registration-email-confirmation/registration-email-confirmation.component').then(mod => mod.RegistrationEmailConfirmationComponent),
      canActivate: [UnAuthGuard],
    },  
    {
      path: 'additional-info-signup',
      loadComponent: () => import('./core/auth/pages/additional-info-signup/additional-info-signup.component').then(mod => mod.AdditionalInfoSignupComponent),
      canActivate: [UnAuthGuard],
    },
    {
      path: '**',
      loadComponent: () => import('./core/auth/pages/page-not-found/page-not-found.component')
        .then(mod => mod.PageNotFoundComponent),
        // canActivate: [UnAuthGuard],
    }
];
