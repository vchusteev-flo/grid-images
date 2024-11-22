import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { NgxsModule } from '@ngxs/store';
import { Amplify } from 'aws-amplify';
import { AppComponent } from './app.component';
import { PicturesState } from './store/picutre.state';


const testConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: '23idbte48qsu7n1fb6i089uval',
      userPoolId: 'eu-north-1_bmcr2QviW',
      identityPoolId: 'eu-north-1:e0a9c54d-b839-4bcc-be6a-66a738cda992'
    }
  }
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  
  beforeEach(async () => {
    Amplify.configure(testConfig);

    await TestBed.configureTestingModule({
      imports: [
        AppComponent, 
        AmplifyAuthenticatorModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([PicturesState])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
});

  it('should display the authenticator when isLoginVisible is true', () => {
    component.isLoginVisible = true;
    fixture.detectChanges();
    const authenticator = fixture.debugElement.query(By.css('amplify-authenticator'));
    expect(authenticator).toBeTruthy();
  });

  it('should not display the authenticator when isLoginVisible is false', () => {
    component.isLoginVisible = false;
    fixture.detectChanges();
    const authenticator = fixture.debugElement.query(By.css('amplify-authenticator'));
    const computedStyle = window.getComputedStyle(authenticator.nativeElement);
    expect(computedStyle.display).toBe('none');
  });

//   it('should display snack bar when user is authenticated', () => {
//     // Set up the authenticated user state
//     const mockUser = { username: 'testUser' };
//     console.table(component)
//     component.user = mockUser;  // Make sure to set the user property on the component
//     component.isLoginVisible = true;
//     component.isAuthenticated = true;  // Add this if your component uses an isAuthenticated flag
    
//     // Trigger change detection
//     fixture.detectChanges();
    
//     // Query for snack bar
//     const snackBar = fixture.debugElement.query(By.css('app-snack-bar'));
    
//     expect(snackBar).toBeTruthy();
// });


  // it('should not display snack bar when user is not authenticated', () => {
  //   const mockUser = { username: null };
  //   component.isLoginVisible = true;
  //   fixture.detectChanges();
  //   const snackBar = fixture.debugElement.query(By.css('app-snack-bar'));
  //   expect(snackBar).toBeFalsy();
  // });
});
