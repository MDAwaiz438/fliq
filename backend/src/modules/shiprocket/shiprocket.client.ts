import axios, { AxiosInstance } from "axios";
import { env } from "../../config/env";

export class ShiprocketClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.client = axios.create({
      baseURL: env.SHIPROCKET_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Authenticate & Cache JWT Token
  private async getAuthToken(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiresAt) {
      return this.token;
    }

    try {
      const response = await this.client.post("/auth/login", {
        email: env.SHIPROCKET_EMAIL,
        password: env.SHIPROCKET_PASSWORD,
      });

      this.token = response.data.token;
      // Token valid for 9 days (777600000ms), refresh at 8 days
      this.tokenExpiresAt = Date.now() + 8 * 24 * 60 * 60 * 1000;
      return this.token!;
    } catch (err: any) {
      console.error(`[SHIPROCKET_AUTH_FAILED] ${err.message}`);
      throw new Error(`Shiprocket Auth Failed: ${err.message}`);
    }
  }

  public async post<T>(endpoint: string, data?: any): Promise<T> {
    const token = await this.getAuthToken();
    const res = await this.client.post<T>(endpoint, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  public async get<T>(endpoint: string, params?: any): Promise<T> {
    const token = await this.getAuthToken();
    const res = await this.client.get<T>(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return res.data;
  }
}

export const shiprocketClient = new ShiprocketClient();
