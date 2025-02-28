export interface Environment {
  production: boolean;
  luv2shopApiUrl: string;
}

export const environment: Environment = {
  production: false,
  luv2shopApiUrl: "https://localhost:8443/api"
};
