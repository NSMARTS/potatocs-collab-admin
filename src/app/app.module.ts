import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgMaterialUIModule } from './ng-material-ui/ng-material-ui.module';

// Module
import { AuthModule } from './components/auth/auth.module';
import { ApproutingModule } from './app-routing.module';

// Config
import { ENV } from './config/config';

// Guard
import { SignInGuard } from './services/auth/signIn.guard';

// Component
import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { LeaveMngmtModule } from './components/leave-mngmt/leave-mngmt.module';
import { ProfileEditModule } from './components/profile-edit/profile-edit.module';

export function tokenGetter() {
	return localStorage.getItem(ENV.tokenName);
}
@NgModule({
    declarations: [
      AppComponent,
      IndexComponent,
    ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      NgMaterialUIModule,
      FormsModule,
      HttpClientModule,
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          disallowedRoutes: [
            '/api/v1/auth/sign-in',
		        '/api/v1/auth/sign-up',
          ]
        }
      }),
      AuthModule,
      LeaveMngmtModule,
      ProfileEditModule,
      ApproutingModule,
    ],
    providers: [SignInGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }


