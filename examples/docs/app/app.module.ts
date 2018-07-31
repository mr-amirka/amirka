import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { RouterModule, ROUTES_DECLARATIONS } from './routes';


//DIRECTIVES
import { XDirective } from '../../../src/directives/x.directive';
import { MDirective } from '../../../src/directives/m.directive';
import { CodeDirective } from '../../../src/directives/code.directive';
//import { TranslateDirective } from '../../../src/directives/translate.directive';

//COMPONENTS
import { RootComponent } from './components/root/root.component';
import { DonateComponent } from './components/donate/donate.component';

//PIPES
//import { LocalePipe } from './pipes/locale.pipe';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule,
    MatMenuModule,
    MatButtonModule
    //HttpModule,
    //FormsModule,
  ],
  declarations: [

    XDirective,
    MDirective,
    //TranslateDirective,
    CodeDirective,

    RootComponent,
    DonateComponent,

    ...ROUTES_DECLARATIONS
  ],
  bootstrap: [
    RootComponent
  ]
})
export class AppModule {}