import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from '@fake-db/fake-db.service';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuModule } from '@ctrl/ngx-rightclick';

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';

import { coreConfig } from 'app/app-config';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { fakeBackendProvider } from 'app/auth/helpers'; // used to create fake backend
import { JwtInterceptor, ErrorInterceptor } from 'app/auth/helpers';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { ContextMenuComponent } from 'app/main/extensions/context-menu/context-menu.component';
import { AnimatedCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/animated-custom-context-menu/animated-custom-context-menu.component';
import { BasicCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/basic-custom-context-menu/basic-custom-context-menu.component';
import { SubMenuCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/sub-menu-custom-context-menu/sub-menu-custom-context-menu.component';
import { ViewFileContractComponent } from './main/shared/view-file-contract/view-file-contract.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'environments/environment';
import { HighchartsChartModule } from 'highcharts-angular';

const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./main/auth/auth.module').then((m) => { return m.AuthModule })
  },
  {
    path: 'profile',
    loadChildren: () => import('./main/profile/profile.module').then((m) => {return m.ProfileModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'role',
    loadChildren: () => import('./main/role/role.module').then((m) => {return m.RoleModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./main/admin/admin.module').then((m) => {return m.AdminModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'customer',
    loadChildren: () => import('./main/customer/customer.module').then((m) => {return m.CustomerModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./main/user/user.module').then((m) => {return m.UserModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'agent',
    loadChildren: () => import('./main/agent/agent.module').then((m) => { return m.AgentModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'sim-so',
    loadChildren: () => import('./main/sim-so/sim-so.module').then((m) => { return m.SimSoModule }),
    canActivate: [AuthGuard]
  },

  {
    path: 'gip',
    loadChildren: () => import('./main/gip/gip.module').then((m) => { return m.GIPModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'gtalk',
    loadChildren: () => import('./main/gtalk/gtalk.module').then((m) => { return m.GtalkModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'files',
    loadChildren: () => import('./main/files/files.module').then((m) => { return m.FilesModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'contract',
    loadChildren: () => import('./main/contract/contract.module').then((m) => { return m.ContractModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'loan-bank',
    loadChildren: () => import('./main/loan-bank/loan-bank.module').then((m) => { return m.LoanBankModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'task',
    loadChildren: () => import('./main/task/task.module').then((m) => { return m.TaskModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'file',
    loadChildren: () => import('./main/files/files.module').then((m) => { return m.FilesModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'people',
    loadChildren: () => import('./main/people/people.module').then((m) => { return m.PeopleModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'transaction',
    loadChildren: () => import('./main/transaction/transaction.module').then((m) => { return m.TransactionModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'sms-log',
    loadChildren: () => import('./main/sms-log/sms-log.module').then((m) => { return m.SmsLogModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'order-ltg',
    loadChildren: () => import('./main/order-ltg/order-ltg.module').then((m) => { return m.OrderLtgModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'merchant',
    loadChildren: () => import('./main/agency/agency.module').then((m) => { return m.AgencyModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'airtime',
    loadChildren: () => import('./main/merchant/merchant.module').then((m) => { return m.MerchantModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'services',
    loadChildren: () => import('./main/gservice/gservice.module').then((m) => { return m.GserviceModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'inventory',
    loadChildren: () => import('./main/inventory/inventory.module').then((m) => { return m.InventoryModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'collaborator',
    loadChildren: () => import('./main/collaborator/collaborator.module').then((m) => { return m.CollaboratorModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./main/dashboard/dashboard.module').then((m) => { return m.DashboardModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'apps',
    loadChildren: () => import('./main/apps/apps.module').then((m) => { return m.AppsModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then((m) => { return m.PagesModule })
  },
  {
    path: 'ui',
    loadChildren: () => import('./main/ui/ui.module').then((m) => {m.UIModule}),
    canActivate: [AuthGuard]
  },
  {
    path: 'components',
    loadChildren: () => import('./main/components/components.module').then((m) => { return m.ComponentsModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'extensions',
    loadChildren: () => import('./main/extensions/extensions.module').then((m) => { return m.ExtensionsModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'forms',
    loadChildren: () => import('./main/forms/forms.module').then((m) => { return m.FormsModule }),
    canActivate: [AuthGuard]
  },
  {
    path: 'tables',
    loadChildren: () => import('./main/tables/tables.module').then((m) => { return m.TablesModule }),
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'charts-and-maps',
  //   loadChildren: () => import('./main/charts-and-maps/charts-and-maps.module').then(m => m.ChartsAndMapsModule),
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'share',
    loadChildren: () => import('./main/shared/share.module').then((m) => { return m.SharedModule }),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard/reports',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
  },
];

@NgModule({
  declarations: [
    AppComponent,
    ContextMenuComponent,
    BasicCustomContextMenuComponent,
    AnimatedCustomContextMenuComponent,
    SubMenuCustomContextMenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true
    }),
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy'
    }),
    NgbModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot(),
    ContextMenuModule,
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,
    CardSnippetModule,
    LayoutModule,
    ContentHeaderModule,
    ServiceWorkerModule.register('/firebase-messaging-sw.js', { enabled: true }),
    // HighchartsChartModule 
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // ! IMPORTANT: Provider used to create fake backend, comment while using real API
    // fakeBackendProvider
  ],
  entryComponents: [BasicCustomContextMenuComponent, AnimatedCustomContextMenuComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
