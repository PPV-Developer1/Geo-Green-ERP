import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { ApplicationComponent } from './application.component';
import { BlankComponent } from './blank/blank.component';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
    {
        path: '',
        component: ApplicationComponent,
        children:[
            { path:'', redirectTo:'Dashboard', pathMatch:'full' },
            { path: 'Dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), data: { breadcrumb: 'Dashboard' }  },

            { path: 'unauth', loadChildren: () => import('./unauth/unauth.module').then(m => m.UnauthModule), data: { breadcrumb: 'Unauthenticated' }  },

            { path: 'accounts', loadChildren: () => import('./account/bank_list/bank_list.module').then(m => m.Bank_listModule), data: { breadcrumb: 'ACCOUNTS' }  },
            { path: 'accounts', loadChildren: () => import('./account/expense/expense.module').then(m => m.ExpenseModule), data: { breadcrumb: 'ACCOUNTS' }  },
            { path: 'accounts', loadChildren: () => import('./account/payment_transfer/payment_transfer.module').then(m => m.Payment_transferModule), data: { breadcrumb: 'ACCOUNTS' }  },
            { path: 'accounts', loadChildren: () => import('./account/payment_recieved/payment_recieved.module').then(m => m.Payment_recievedModule), data: { breadcrumb: 'ACCOUNTS' }  },
            { path: 'accounts', loadChildren: () => import('./account/payment_made/payment_made.module').then(m => m.Payment_madeModule), data: { breadcrumb: 'ACCOUNTS' }  },
            { path: 'accounts', loadChildren: () => import('./account/credit_note/credit_note.module').then(m => m.Credit_noteModule), data: { breadcrumb: 'ACCOUNTS' }  },
             { path: 'accounts', loadChildren: () => import('./account/debit_note/debit_note.module').then(m => m.Debit_noteModule), data: { breadcrumb: 'ACCOUNTS' }  },

            { path: 'hr', loadChildren: () => import('./HR/employee/employee.module').then(m => m.EmployeeModule), data: { breadcrumb: 'HR' }  },
            { path: 'hr', loadChildren: () => import('./HR/attendance/attendance.module').then(m => m.AttendanceModule), data: { breadcrumb: 'HR' }  },
            { path: 'hr', loadChildren: () => import('./HR/salary/salary.module').then(m => m.SalaryModule), data: { breadcrumb: 'HR' }  },


            { path: 'items', loadChildren: () => import('./items/item_list/item_list.module').then(m => m.Item_listModule), data: { breadcrumb: 'ITEMS' }  },
            { path: 'items', loadChildren: () => import('./items/item_category/item_category.module').then(m => m.Item_categoryModule), data: { breadcrumb: 'ITEMS' }  },

            { path: 'sales', loadChildren: () => import('./sales/customer/customer.module').then(m => m.CustomerModule), data: { breadcrumb: 'ITEMS' }  },
            { path: 'sales', loadChildren: () => import('./sales/invoice/invoice.module').then(m => m.InvoiceModule), data: { breadcrumb: 'ITEMS' }  },
            { path: 'sales', loadChildren: () => import('./sales/delivery_challan/delivery_challan.module').then(m => m.Delivery_challanModule), data: { breadcrumb: 'ITEMS' }  },

            { path: 'purchase', loadChildren: () => import('./purchase/vendor/vendor.module').then(m => m.VendorModule), data: { breadcrumb: 'PURCHASE' }  },
            { path: 'purchase', loadChildren: () => import('./purchase/purchase_request/purchase_request.module').then(m => m.Purchase_requestModule), data: { breadcrumb: 'PURCHASE' }  },
            { path: 'purchase', loadChildren: () => import('./purchase/purchase_order/purchase_order.module').then(m => m.Purchase_orderModule), data: { breadcrumb: 'PURCHASE' }  },
            { path: 'purchase', loadChildren: () => import('./purchase/bills/bills.module').then(m => m.BillsModule), data: { breadcrumb: 'PURCHASE' }  },
            { path: 'purchase', loadChildren: () => import('./purchase/acceptence/acceptence.module').then(m => m.AcceptenceModule), data: { breadcrumb: 'PURCHASE' }  },
            { path: 'purchase', loadChildren: () => import('./purchase/debit_note/debit_note.module').then(m => m.Debit_noteModule), data: { breadcrumb: 'PURCHASE' }  },
            { path: 'purchase', loadChildren: () => import('./purchase/credit_note/credit_note.module').then(m => m.Credit_noteModule), data: { breadcrumb: 'PURCHASE' }  },

            { path: 'projects', loadChildren: () => import('./projects/project/project.module').then(m => m.ProjectModule), data: { breadcrumb: 'PROJECT' }  },
            { path: 'projects', loadChildren: () => import('./projects/association/association.module').then(m => m.AssociationModule), data: { breadcrumb: 'PROJECT' }  },
            { path: 'projects', loadChildren: () => import('./projects/byproduct/byproduct.module').then(m => m.ByproductModule), data: { breadcrumb: 'PROJECT' }  },
            { path: 'projects', loadChildren: () => import('./projects/category/category.module').then(m => m.CategoryModule), data: { breadcrumb: 'PROJECT' }  },


            { path: 'tracking', loadChildren: () => import('./tracking/tracking.module').then(m => m.TrackingModule), data: { breadcrumb: 'TRACKING' }  },

            { path: 'store', loadChildren: () => import('./store/inward/inward.module').then(m => m.InwardModule), data: { breadcrumb: 'STORE' }  },
            { path: 'store', loadChildren: () => import('./store/outward/outward.module').then(m => m.OutwardModule), data: { breadcrumb: 'STORE' }  },
            { path: 'store', loadChildren: () => import('./store/stock_list/stock_list.module').then(m => m.Stock_listModule), data: { breadcrumb: 'STORE' }  },
            { path: 'store', loadChildren: () => import('./store/requirement/requirement.module').then(m => m.RequirementModule), data: { breadcrumb: 'STORE' }  },
            { path: 'store', loadChildren: () => import('./store/dispatch/dispatch.module').then(m => m.DispatchModule), data: { breadcrumb: 'STORE' }  },
            { path: 'store', loadChildren: () => import('./store/outward_sales/outward_sales.module').then(m => m.Outward_salesModule), data: { breadcrumb: 'STORE' }  },
            { path: 'store', loadChildren: () => import('./store/product_stock_list/product_stock_list.module').then(m => m.Product_stock_listModule), data: { breadcrumb: 'STORE' }  },


            { path: 'production', loadChildren: () => import('./production/planning/planning.module').then(m => m.PlanningModule), data: { breadcrumb: 'PRODUCTION' }  },
            { path: 'production', loadChildren: () => import('./production/approval/approval.module').then(m => m.ApprovalModule), data: { breadcrumb: 'PRODUCTION' }  },
            { path: 'production', loadChildren: () => import('./production/project_expenses/project_expenses.module').then(m => m.Project_expensesModule), data: { breadcrumb: 'PRODUCTION' }  },
            { path: 'production', loadChildren: () => import('./production/moniter/moniter.module').then(m => m.MoniterModule), data: { breadcrumb: 'PRODUCTION' }  },

            { path: 'report', loadChildren: () => import('./report/report/report.module').then(m => m.ReportModule), data: { breadcrumb: 'REPORT' }  },

            { path: 'report/profit_and_loss', loadChildren: () => import('./report/profit_and_loss/profit_and_loss.module').then(m => m.Profit_and_lossModule), data: { breadcrumb: 'REPORT' }  },

            { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule), data: { breadcrumb: 'SETTINGS' }  },

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
export class ApplicationRoutingModule { }
