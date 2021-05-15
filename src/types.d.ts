export type AccessTokenResponse = {
  jwtToken: string;
  jwtExpiryDate: string;
};

export interface ErrorResponse extends Error {}
