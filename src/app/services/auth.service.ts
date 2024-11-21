import { Injectable } from '@angular/core';
import {signOut, signIn, getCurrentUser} from 'aws-amplify/auth'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { defaultStorage } from 'aws-amplify/utils';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	async getCurrentAuthenticatedUser() {
		try {
			const user = getCurrentUser();
			return user;
		} catch (err) {
			return null;
		}
	}
	async signOut() {
		try {
			await signOut();
		}
		catch (err) {
			console.log(err, 'sign out error');
		}
	}
}

cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);