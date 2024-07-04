import { OpenAPI } from "@local/api-generated";


const TOKEN_KEY = 'AUTHENTICATION_TOKEN_KEY';

export class TokenManager {
  private static instance: TokenManager;
  private token?: string;

  private constructor() {
    this.token = localStorage.getItem(TOKEN_KEY) || undefined;
  }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  public setToken(token?: string): void {
    this.token = token;
    OpenAPI.TOKEN = token;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  public getToken(): string | undefined {
    return this.token;
  }
}

export const tokenManager = TokenManager.getInstance();
