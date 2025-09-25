import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { DirectivesModule } from '../theme/directives/directives.module';
import { PipesModule } from '../theme/pipes/pipes.module';
import { PagesRoutingModule } from './pages.routing';
import { PagesComponent } from './pages.component';
import { BlankComponent } from './blank/blank.component';
import { SidebarComponent } from '../theme/components/sidebar/sidebar.component';
import { MessagesComponent } from '../theme/components/messages/messages.component';
import { BreadcrumbComponent } from '../theme/components/breadcrumb/breadcrumb.component';
import { BackTopComponent } from '../theme/components/back-top/back-top.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  imports: [
    CommonModule,
    NgScrollbarModule,
    DirectivesModule,
    PipesModule,
    PagesRoutingModule
  ],
  declarations: [
    PagesComponent,
    BlankComponent,
    SidebarComponent,
    MessagesComponent,
    BreadcrumbComponent,
    BackTopComponent,
    SearchComponent
  ]
})
export class PagesModule { }
