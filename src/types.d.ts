export type AccessTokenResponse = {
  jwt: string;
  jwtExpiryDate: string;
};

export interface ErrorResponse extends Error {}
