import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { StoreModule } from '@ngrx/store';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { AuthService } from './auth/auth.service';
import { environment } from '../environments/environment';
import { UiService } from './shared/ui.service';
import { AuthModule } from './auth/auth.module';
import { reducers } from './app.reducer';
import { PoolComponent } from './pool/pool.component';
import { PoolService } from './pool/pool.service';
import { AddPlayerComponent } from './pool/add-player.component';
import { RegisterFightComponent } from './pool/register-fight.component';
import { ShowFightsComponent } from './pool/show-fights.component';
import { PlannedFightComponent } from './pool/planned-fight.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,
    PoolComponent,
    AddPlayerComponent,
    RegisterFightComponent,
    ShowFightsComponent,
    PlannedFightComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AuthModule,
    StoreModule.forRoot(reducers)
  ],
  entryComponents: [AddPlayerComponent, RegisterFightComponent, ShowFightsComponent, PlannedFightComponent],
  providers: [AuthService, UiService, PoolService],
  bootstrap: [AppComponent]
})
export class AppModule { }
