import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './base/base.component';


// Components

const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: BaseComponent
      },
      {
          path: 'l/:escape',
          component: BaseComponent
      },
      {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full',
      }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
