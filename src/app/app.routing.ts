import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuard } from './views/guard/auth.guard';
import { CadastroPedidosComponent } from './views/cadastros/cadastro-pedidos/cadastro-pedidos.component';
import { CadastroProdutosComponent } from './views/cadastros/cadastro-produtos/cadastro-produtos.component';
import { ListagemPedidosComponent } from './views/cadastros/listagem-pedidos/listagem-pedidos.component';
import { ListagemProdutosComponent } from './views/cadastros/listagem-produtos/listagem-produtos.component';
import { CadastroUsuariosComponent } from './views/cadastros/cadastro-usuarios/cadastro-usuarios.component';
import { ListagemUsuariosComponent } from './views/cadastros/listagem-usuarios/listagem-usuarios.component';
import { TesteNavComponent } from './views/cadastros/teste-nav/teste-nav.component';
import { TesteFormComponent } from './views/cadastros/teste-form/teste-form.component';
import { ListaUsuariosComponent } from './views/cadastros/lista-usuarios/lista-usuarios.component';
import { ListaPedidosComponent } from './views/cadastros/lista-pedidos/lista-pedidos.component';
import { ListaProdutosComponent } from './views/cadastros/lista-produtos/lista-produtos.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    canActivate:[AuthGuard]
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'cadastro-pedidos',
    component: CadastroPedidosComponent,
    data: {
      title: 'Novo Pedido'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate:[AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'lista-de-usuario',
        component: ListaUsuariosComponent,
        data: {
          title: 'Lista de Usuários'
        }
      },
      {
        path: 'cadastro-pedidos/:id',
        component: CadastroPedidosComponent,
        data: {
          title: 'Editar Pedidos'
        }
      },
      {
        path: 'lista-de-pedidos',
        component: ListaPedidosComponent,
        data: {
          title: 'Lista de Pedidos'
        }
      },
      {
        path: 'cadastro-produtos',
        component: CadastroProdutosComponent,
        data: {
          title: 'Novo Produto'
        }
      },
      {
        path: 'cadastro-produtos/:id',
        component: CadastroProdutosComponent,
        data: {
          title: 'Editar Produto'
        }
      },
      {
        path: 'lista-de-produtos',
        component: ListaProdutosComponent,
        data: {
          title: 'Lista de Produtos'
        }
      },
      {
        path: 'cadastro-usuario',
        component: CadastroUsuariosComponent,
        data: {
          title: 'Novo Usuário'
        }
      },
      {
        path: 'cadastro-usuario/:id',
        component: CadastroUsuariosComponent,
        data: {
          title: 'Editar Usuário'
        }
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/buttons.module').then(m => m.ButtonsModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
