import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';



import { RouterModule, ROUTES_DECLARATIONS } from './app.states';


//DIRECTIVES
import { XDirective } from './directives/x.directive';
import { MDirective } from './directives/m.directive';


//COMPONENTS
import { RootComponent } from './components/root/root.component';


@NgModule({
  imports: [
    BrowserModule,
    RouterModule,

    FormsModule,
    HttpModule
  ],
  declarations: [
    XDirective,
    MDirective,
    RootComponent,
    ...ROUTES_DECLARATIONS
  ],
  bootstrap: [
    RootComponent
  ]
})
export class AppModule {}