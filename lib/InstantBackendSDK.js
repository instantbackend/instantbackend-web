/**
 * InstantBackend JavaScript SDK
 * Generated from simple-backend-Prod-oas30.yaml
 */

class InstantBackend {
  /**
   * Initialize the InstantBackend SDK
   * @param {string} apiKey - API key for authentication
   * @param {string} [jwtToken] - Optional JWT token for authentication
   * @param {string} [baseUrlOverride] - Optional API base URL (defaults to env or prod)
   */
  constructor(apiKey, jwtToken = null, baseUrlOverride = null) {
    this.apiKey = apiKey;
    this.jwtToken = jwtToken;
    const envBaseUrl = typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_INSTANTBACKEND_BASE_URL
      : null;
    this.baseUrl = baseUrlOverride || envBaseUrl || 'https://hexsl81t5f.execute-api.eu-west-1.amazonaws.com/dev';

  }

  /**
   * Helper to standardize errors with HTTP status attached.
   * @param {string} message
   * @param {Response} response
   */
  throwResponseError(message, response) {
    const error = new Error(message);
    error.status = response?.status;
    throw error;
  }

  /**
   * Register a new user
   * @param {Object} params - registration data
   * @param {string} params.username
   * @param {string} params.password
   * @param {string} [params.email]
   * @param {string} [params.fullName]
   * @returns {Promise<Object>} - Registration response
   */
  async register({ username, password, email, fullName }) {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { 'X-API-Key': this.apiKey } : {}),
        },
        body: JSON.stringify({
          username,
          password,
          extraInfo: {
            email,
            fullName,
          },
        }),
      });

      await this.handleAuthRedirect(response);

      if (!response.ok) {
        this.throwResponseError('Registration failed', response);
      }

      return await response.json();
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  /**
   * Create a collection reference
   * @param {string} collection - The collection/collection name
   * @returns {Collection} - A Collection object for the specified collection
   */
  collection(collection) {
    return new Collection(this, collection);
  }

  /**
   * Authenticate user and get token
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<Object>} - Authentication response with token
   */
  async login(username, password) {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, apiKey: this.apiKey })
      });

      await this.handleAuthRedirect(response);

      if (!response.ok) {
        this.throwResponseError('Authentication failed', response);
      }

      const authResponse = await response.json();

      // Store the JWT token
      if (authResponse.token) {
        this.jwtToken = authResponse.token;
      }

      return authResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Create a payment intent for one-time payments
   * @param {number} amount - Amount in cents
   * @param {string} currency - Currency code (default: 'eur')
   * @param {string} description - Payment description
   * @returns {Promise<Object>} - Payment intent response
   */
  async createPaymentIntent(amount, currency = 'eur', description = '') {
    try {
      const response = await fetch(`${this.baseUrl}/payment/create-intent`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ amount, currency, description })
      });

      await this.handleAuthRedirect(response);

      if (!response.ok) {
        this.throwResponseError('Failed to create payment intent', response);
      }

      return await response.json();
    } catch (error) {
      console.error('Create payment intent error:', error);
      throw error;
    }
  }

  /**
   * Create a subscription
   * @param {string} priceId - Stripe price ID
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>} - Subscription response
   */
  async createSubscription(priceId, customerId) {
    try {
      const response = await fetch(`${this.baseUrl}/subscription/create`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ priceId, customerId })
      });

      await this.handleAuthRedirect(response);

      if (!response.ok) {
        this.throwResponseError('Failed to create subscription', response);
      }

      return await response.json();
    } catch (error) {
      console.error('Create subscription error:', error);
      throw error;
    }
  }

  /**
   * Get Stripe subscription status for the current user
   * @returns {Promise<Object>} - Subscription status payload
   */
  async getSubscriptionStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/stripe/subscription/status`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      await this.handleAuthRedirect(response);

      if (!response.ok) {
        this.throwResponseError('Failed to get subscription status', response);
      }

      return await response.json();
    } catch (error) {
      console.error('Get subscription status error:', error);
      throw error;
    }
  }

  /**
   * Start a Stripe Checkout session
   * @param {Object} params
   * @param {string} params.priceId - Stripe price ID
   * @param {string} params.successUrl - Redirect URL after success
   * @param {string} params.cancelUrl - Redirect URL after cancel
   * @returns {Promise<Object>} - Checkout session response (expects a url)
   */
  async createCheckoutSession({ priceId, successUrl, cancelUrl }) {
    try {
      const response = await fetch(`${this.baseUrl}/stripe/checkout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ priceId, successUrl, cancelUrl })
      });

      await this.handleAuthRedirect(response);

      if (!response.ok) {
        this.throwResponseError('Failed to start checkout', response);
      }

      return await response.json();
    } catch (error) {
      console.error('Create checkout session error:', error);
      throw error;
    }
  }

  /**
   * Create a Stripe Billing Portal session
   * @param {Object} params
   * @param {string} params.returnUrl - URL to return to after portal session
   * @returns {Promise<Object>} - Portal session response (expects a url)
   */
  async createBillingPortalSession({ returnUrl }) {
    try {
      const response = await fetch(`${this.baseUrl}/stripe/portal`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ returnUrl })
      });

      await this.handleAuthRedirect(response);

      if (!response.ok) {
        this.throwResponseError('Failed to create billing portal session', response);
      }

      return await response.json();
    } catch (error) {
      console.error('Create billing portal session error:', error);
      throw error;
    }
  }

  /**
   * Get customer payment methods
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>} - Payment methods response
   */
  async getPaymentMethods(customerId) {
    try {
      const response = await fetch(`${this.baseUrl}/payment/methods/${customerId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      await this.handleAuthRedirect(response);

      if (!response.ok) {
        this.throwResponseError('Failed to get payment methods', response);
      }

      return await response.json();
    } catch (error) {
      console.error('Get payment methods error:', error);
      throw error;
    }
  }

  /**
   * Get user's current subscription
   * @returns {Promise<Object>} - Subscription details
   */
  async getSubscription() {
    try {
      const response = await fetch(`${this.baseUrl}/subscription/current`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      await this.handleAuthRedirect(response);

      if (!response.ok) {
        this.throwResponseError('Failed to get subscription', response);
      }

      return await response.json();
    } catch (error) {
      console.error('Get subscription error:', error);
      throw error;
    }
  }

  /**
   * Cancel user's subscription
   * @returns {Promise<Object>} - Cancellation response
   */
  async cancelSubscription() {
    try {
      const response = await fetch(`${this.baseUrl}/subscription/cancel`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      await this.handleAuthRedirect(response);

      if (!response.ok) {
        this.throwResponseError('Failed to cancel subscription', response);
      }

      return await response.json();
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  }

  /**
   * Get authorization headers based on available authentication methods
   * @returns {Object} - Headers object with appropriate authorization
   */
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    // Use JWT token if available, otherwise use API key
    if (this.jwtToken) {
      headers['Authorization'] = `Bearer ${this.jwtToken}`;
    } else if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    return headers;
  }

  /**
   * Redirect to login on auth errors (401/403) in browser context.
   */
  async handleAuthRedirect(response) {
    if (response.status === 401 || response.status === 403) {
      let message = 'Authentication required';
      try {
        const contentType = response.headers?.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const payload = await response.clone().json();
          const serverMessage =
            payload?.error ||
            payload?.message ||
            payload?.detail ||
            payload?.title;
          if (typeof serverMessage === 'string' && serverMessage.trim()) {
            message = serverMessage;
          }
        } else {
          const text = await response.clone().text();
          if (typeof text === 'string' && text.trim()) {
            message = text.trim();
          }
        }
      } catch (error) {
        console.warn('Failed to parse auth error response:', error);
      }
      this.throwResponseError(message, response);
    }
    return response;
  }
}

class Collection {
  /**
   * Initialize a collection
   * @param {InstantBackend} instantBackend - InstantBackend instance
   * @param {string} collection - collection/collection name
   */
  constructor(instantBackend, collection) {
    this.instantBackend = instantBackend;
    this.collection = collection;
    this.filters = [];
    this.limitValue = null;
    this.sortOrder = null;
    this.nextTokenValue = null;
  }

  /**
   * Get authorization headers based on available authentication methods
   * @returns {Object} - Headers object with appropriate authorization
   */
  getAuthHeaders() {
    return this.instantBackend.getAuthHeaders();
  }

  /**
   * Add a document to the collection
   * @param {Object} data - Document data to add
   * @returns {Promise<Object>} - Response with the created document ID
   */
  async add(data) {
    try {
      const response = await fetch(`${this.instantBackend.baseUrl}/${this.collection}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      await this.instantBackend.handleAuthRedirect(response);

      if (!response.ok) {
        this.instantBackend.throwResponseError('Failed to add document', response);
      }

      return await response.json();
    } catch (error) {
      console.error('Add document error:', error);
      throw error;
    }
  }

  /**
   * Add a filter condition
   * @param {string} field - Field name
   * @param {string} operator - Operator (==, >, <, etc.)
   * @param {any} value - Value to compare against
   * @returns {Collection} - Returns this collection for chaining
   */
  where(field, operator, value) {
    // For simplicity, we'll only implement the == operator for now
    if (operator === '==') {
      this.filters.push({ field, value });
    } else {
      console.warn(`Operator ${operator} not fully implemented. Using equality.`);
      this.filters.push({ field, value });
    }
    return this;
  }

  /**
   * Set the maximum number of results to return
   * @param {number} n - Maximum number of results
   * @returns {Collection} - Returns this collection for chaining
   */
  limit(n) {
    this.limitValue = n;
    return this;
  }

  /**
   * Set the sort order
   * @param {string} order - Sort order ('asc' or 'desc')
   * @returns {Collection} - Returns this collection for chaining
   */
  sort(order) {
    if (order === 'asc' || order === 'desc') {
      this.sortOrder = order;
    } else {
      console.warn(`Invalid sort order: ${order}. Using default.`);
    }
    return this;
  }

  /**
   * Set the pagination token
   * @param {string} token - Next token for pagination
   * @returns {Collection} - Returns this collection for chaining
   */
  nextToken(token) {
    this.nextTokenValue = token;
    return this;
  }

  /**
   * Execute the query and get results
   * @returns {Promise<Object>} - Query results
   */
  async get() {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();

      // Add filters as query parameters
      this.filters.forEach(filter => {
        queryParams.append(filter.field, filter.value);
      });

      // Add limit if specified
      if (this.limitValue) {
        queryParams.append('limit', this.limitValue);
      }

      // Add sort order if specified
      if (this.sortOrder) {
        queryParams.append('sort', this.sortOrder);
      }

      // Add next token if specified
      if (this.nextTokenValue) {
        queryParams.append('nextToken', this.nextTokenValue);
      }

      // Build the URL with query parameters
      const url = `${this.instantBackend.baseUrl}/${this.collection}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      await this.instantBackend.handleAuthRedirect(response);

      if (!response.ok) {
        this.instantBackend.throwResponseError('Query failed', response);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  /**
   * Get a document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Object>} - Document data
   */
  async doc(id) {
    try {
      const response = await fetch(`${this.instantBackend.baseUrl}/${this.collection}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      await this.instantBackend.handleAuthRedirect(response);

      if (!response.ok) {
        this.instantBackend.throwResponseError('Failed to get document', response);
      }

      return await response.json();
    } catch (error) {
      console.error('Get document error:', error);
      throw error;
    }
  }
}

// Export using ES6 modules
export { InstantBackend };


