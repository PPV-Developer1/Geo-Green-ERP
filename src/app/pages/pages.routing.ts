import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from './pages.component';
import { BlankComponent } from './blank/blank.component';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
    {
        path: '', 
        component: PagesComponent,
        children:[
            { path:'', redirectTo:'dashboard', pathMatch:'full' },
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), data: { breadcrumb: 'Dashboard' }  },
            { path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule), data: { breadcrumb: 'Maps' } },
            { path: 'charts', loadChildren: () => import('./charting/charting.module').then(m => m.ChartingModule), data: { breadcrumb: 'Charts' } },
            { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule), data: { breadcrumb: 'UI' } },
            { path: 'tools', loadChildren: () => import('./tools/tools.module').then(m => m.ToolsModule), data: { breadcrumb: 'Tools' } },
            { path: 'mail', loadChildren: () => import('./mail/mail.module').then(m => m.MailModule), data: { breadcrumb: 'Mail' } },
            { path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule), data: { breadcrumb: 'Calendar' } },
            { path: 'form-elements', loadChildren: () => import('./form-elements/form-elements.module').then(m => m.FormElementsModule), data: { breadcrumb: 'Form Elements' } },
            { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule), data: { breadcrumb: 'Tables' } },
            { path: 'editors', loadChildren: () => import('./editors/editors.module').then(m => m.EditorsModule), data: { breadcrumb: 'Editors' } },
            { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), data: { breadcrumb: 'Profile' }  },      
            { path: 'search', component: SearchComponent, data: { breadcrumb: 'Search' } },
            { path: 'blank', component: BlankComponent, data: { breadcrumb: 'Blank page' } }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class PagesRoutingModule { }