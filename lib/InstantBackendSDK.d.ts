/**
 * Type definitions for InstantBackend JavaScript SDK
 */

export interface ErrorWithStatus extends Error {
  status?: number;
}

export interface RegisterParams {
  username: string;
  password: string;
  email?: string;
  fullName?: string;
}

export interface RegisterResponse {
  token?: string;
  [key: string]: any;
}

export interface LoginResponse {
  token?: string;
  [key: string]: any;
}

export interface PasswordResetRequestParams {
  email?: string;
  username?: string;
}

export interface PasswordResetParams {
  token: string;
  password: string;
}

export interface PaymentIntentParams {
  amount: number;
  currency?: string;
  description?: string;
}

export interface PaymentIntentResponse {
  clientSecret?: string;
  [key: string]: any;
}

export interface SubscriptionParams {
  priceId: string;
  customerId: string;
}

export interface SubscriptionResponse {
  [key: string]: any;
}

export interface CheckoutSessionParams {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResponse {
  url?: string;
  [key: string]: any;
}

export interface BillingPortalParams {
  returnUrl: string;
}

export interface BillingPortalResponse {
  url?: string;
  [key: string]: any;
}

export interface QueryResult {
  items?: any[];
  collections?: any[];
  nextToken?: string;
  [key: string]: any;
}

export interface DocumentResponse {
  id?: string;
  [key: string]: any;
}

export class Collection {
  constructor(instantBackend: InstantBackend, collection: string);
  add(data: Record<string, any>): Promise<DocumentResponse>;
  where(field: string, operator: string, value: any): Collection;
  limit(n: number): Collection;
  sort(order: 'asc' | 'desc'): Collection;
  nextToken(token: string): Collection;
  get(): Promise<QueryResult>;
  doc(id: string): Promise<any>;
  getAuthHeaders(): Record<string, string>;
}

export class InstantBackend {
  apiKey: string;
  jwtToken: string | null;
  baseUrl: string;

  constructor(apiKey: string, jwtToken?: string | null, baseUrlOverride?: string | null);

  throwResponseError(message: string, response: Response): never;
  handleAuthRedirect(response: Response): Promise<Response>;
  getAuthHeaders(): Record<string, string>;

  register(params: RegisterParams): Promise<RegisterResponse>;
  collection(collection: string): Collection;
  login(username: string, password: string): Promise<LoginResponse>;
  requestPasswordReset(params: PasswordResetRequestParams): Promise<any>;
  resetPassword(params: PasswordResetParams): Promise<any>;
  createPaymentIntent(amount: number, currency?: string, description?: string): Promise<PaymentIntentResponse>;
  createSubscription(priceId: string, customerId: string): Promise<SubscriptionResponse>;
  getSubscriptionStatus(): Promise<any>;
  createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSessionResponse>;
  createBillingPortalSession(params: BillingPortalParams): Promise<BillingPortalResponse>;
  getPaymentMethods(customerId: string): Promise<any>;
  getSubscription(): Promise<any>;
  cancelSubscription(): Promise<any>;
}
