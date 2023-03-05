export interface user {
  _id: string;
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  Mobile: string;
  DateofBirth: string;
  Gender: string;
  lastlogin: string;
  image: string;
  aboutme: string;
  createdAt: string;
  __v: number;
}

export interface datatype {
  User: user[];
  totalResults: number;
}

export interface profilepic{
  _id: string;
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  Mobile: string;
  DateofBirth: string;
  Gender: string;
  lastlogin: string;
  image: string;
  aboutme: string;
  createdAt: string;
  __v: number;
}

export interface userProfile {
  name: string ;
  given_name: string ;
  family_name: string ;
  email: string ;
  picture: string | undefined;
}

export interface Profile {
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  picture: string | undefined;
}

export interface updateFormData {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  Mobile: string;
  DateofBirth: string ;
  Gender: string;
  image: string | File;
  aboutme: string;
  [key: string]: string | number | File | null;
}


export interface googleOauthProfile {
  id: string,
  email: string,
  verified_email: boolean,
  name: string,
  given_name: string,
  family_name: string,
  picture: string,
  locale: string
}

export interface googleOauthUser{
    access_token: string,
    authuser?: string,
    expires_in: number,
    prompt: string,
    scope: string,
    token_type: string
}

export interface iAlert {
  msg: string,
  type: string
}

export interface iProps {
  alert : iAlert | null,
  showAlert: (message: string, type: string) => void;
}
