export const menu = [
  {
    title: 'DASHBOARD',
    routerLink: 'Dashboard', 
    icon: 'fa fa-dashboard',
    selected: false,
    expanded: false,
    order: 0
  }, 
  {
    title: 'ACCOUNTS',
    routerLink: 'charts',
    icon: 'fa fa-sitemap',
    selected: false,
    expanded: false,
    order: 500,
    subMenu: [
      {
        title: 'Bank',
        routerLink: 'charts',
      },
      {
        title: 'Transactions',
        routerLink: '#',
      },
      {
        title: 'Expenses',
        routerLink: '#',
      },
    ]
  },
  {
    title: 'HR',
    routerLink: 'charts',
    icon: 'fa fa-book',
    selected: false,
    expanded: false,
    order: 550,
    subMenu: [
      {
        title: 'Employee',
        routerLink: '#',
      },
      {
        title: 'Attendance',
        routerLink: '#',
      },
      {
        title: 'Over Time',
        routerLink: '#',
      },
      {
        title: 'Salary',
        routerLink: '#',
      }
    ]
  },
  {
    title: 'ITEMS',
    routerLink: 'charts',
    icon: 'fa fa-bank',
    selected: false,
    expanded: false,
    order: 500,
    subMenu: [
      {
        title: 'Items',
        routerLink: '#',
      },
      {
        title: 'Category',
        routerLink: '#',
      },
      {
        title: 'Options',
        routerLink: '#',
      }
    ]
  },
  {
    title: 'SALES',
    routerLink: 'charts',
    icon: 'fa fa-briefcase',
    selected: false,
    expanded: false,
    order: 500,
    subMenu: [
      {
        title: 'Customer',
        routerLink: '#',
      },
      {
        title: 'Proforma Invoice',
        routerLink: '#',
      },
      {
        title: 'Invoice',
        routerLink: '#',
      },
      {
        title: 'Delivery Challan',
        routerLink: '#',
      }
    ]
  },
  {
    title: 'PURCHASE',
    routerLink: 'charts',
    icon: 'fa fa-users',
    selected: false,
    expanded: false,
    order: 500,
    subMenu: [
      {
        title: 'Vendor',
        routerLink: '#',
      },
      {
        title: 'Purchase Request',
        routerLink: '#',
      },
      {
        title: 'Purchase Order',
        routerLink: '#',
      },
      {
        title: 'Bills',
        routerLink: '#',
      }
    ]
  },
  {
    title: 'PROJECT',
    routerLink: 'charts',
    icon: 'fa fa-external-link',
    selected: false,
    expanded: false,
    order: 500,
    subMenu: [
      {
        title: 'Project',
        routerLink: '#',
      },
      {
        title: 'Designing and Planning',
        routerLink: '#',
      },
      {
        title: 'Dispatch',
        routerLink: '#',
      },
      {
        title: 'Category',
        routerLink: '#',
      },
      {
        title: 'Project Main Items',
        routerLink: '#',
      },
      {
        title: 'Project Sub Items',
        routerLink: '#',
      },
      {
        title: 'Raw Data',
        routerLink: '#',
      }
    ]
  },
  {
    title: 'TRACKING',
    // id:15,
    routerLink: '#',
    icon: 'fa fa-cogs',
    selected: false,
    expanded: false,
    order: 500,
  },
  {
    title: 'STORE',
    routerLink: 'charts',
    icon: 'fa fa-shopping-cart',
    selected: false,
    expanded: false,
    order: 500,
    subMenu: [
      {
        title: 'Inward',
        routerLink: '#',
      },
      {
        title: 'Outward',
        routerLink: '#',
      },
      {
        title: 'Material Management',
        routerLink: '#',
      },
      {
        title: 'Requirement',
        routerLink: '#',
      },
      {
        title: 'Dispatch',
        routerLink: '#',
      }
    ]
  },
  {
    title: 'PRODUCTION',
    routerLink: 'charts',
    icon: 'fa fa-map-signs',
    selected: false,
    expanded: false,
    order: 500,
    subMenu: [
      {
        title: 'Project Sub Items',
        routerLink: '#',
      },
      {
        title: 'Project Design',
        routerLink: '#',
      },
      {
        title: 'Planning',
        routerLink: '#',
      },
      {
        title: 'Project Expenses',
        routerLink: '#',
      },
      {
        title: 'Requirement',
        routerLink: '#',
      }
    ]
  },
  {
    title: 'REPORTS',
    // id:15,
    routerLink: '#',
    icon: 'fa fa-file-excel-o',
    selected: false,
    expanded: false,
    order: 200,
  },
  {
    title: 'TEST  ',
    // id:15,
    routerLink: '#',
    icon: 'fa fa-cogs',
    selected: false,
    expanded: false,
    order: 500,
  }
];