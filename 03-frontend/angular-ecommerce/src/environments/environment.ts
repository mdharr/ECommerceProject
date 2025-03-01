export interface Environment {
  production: boolean;
  luv2shopApiUrl: string;
	stripePublishableKey: string;
};

export const environment: Environment = {
  production: false,
  luv2shopApiUrl: "https://localhost:8443/api",
	stripePublishableKey: "pk_test_51QxgcuGbDIgGIUoVQqnNI5AFgao4G6rGGKIIq91Dh8Z8bWwwK6EfpHlEdahVh54IFy9dwN29WrDeHeQzBw9fUj1E001Svp2LxU"
};
