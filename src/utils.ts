import { User } from './interfaces';
import { admin } from './firebase'

export interface Auth {
  id: string
  admin: boolean
  [key: string]: any
}

export interface FUser {
  iss: string
  aud: string
  auth_time: number
  user_id: string
  sub: string
  iat: number
  exp: number
  email: string
  email_verified: boolean
  firebase: {
    identities: {
      email: []
    }
    sign_in_provider: string
  }
  uid: string
  admin: boolean
  moderator: boolean
}

export class AuthError extends Error {
  constructor(
    error: { message: string; stack?: any } = { message: 'Not authorized' },
  ) {
    super(error.message)
  }
}

export const deletedUser: User = {
  uid: "string",
  name: "deletedUser",
  displayName: "Deleted User",
  cipherCount: 0,
  pointsCount: 0,
  cipherData: {},
  email: "",
  firstName: "",
  lastName: "",
  profilePicture: null,
  phone: "",
}

var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export function isEmailValid(email) {
    if (!email)
        return false;

    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}

  