export interface LoginRequest {
  username: string;
  password: string;
}

export interface InscriptionRequest {
  username: string;
  password: string;
  email: string;
}

export interface InscriptionAdminRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  username: string;
  email: string;
}

export interface User {
  username: string;
  email: string;
}