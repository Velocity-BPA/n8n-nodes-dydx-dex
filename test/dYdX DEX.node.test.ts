/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { dYdXDEX } from '../nodes/dYdX DEX/dYdX DEX.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('dYdXDEX Node', () => {
  let node: dYdXDEX;

  beforeAll(() => {
    node = new dYdXDEX();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('dYdX DEX');
      expect(node.description.name).toBe('dydxdex');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Market Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.dydx.exchange' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(), 
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get all markets successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getMarkets');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ markets: [] });

    const result = await executeMarketOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.dydx.exchange/v3/markets',
      headers: { 'Authorization': 'Bearer test-key' },
      json: true
    });
  });

  it('should get specific market successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getMarket')
      .mockReturnValueOnce('BTC-USD');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ market: 'BTC-USD' });

    const result = await executeMarketOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.dydx.exchange/v3/markets/BTC-USD',
      headers: { 'Authorization': 'Bearer test-key' },
      json: true
    });
  });

  it('should get orderbook successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getOrderbook')
      .mockReturnValueOnce('BTC-USD');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ bids: [], asks: [] });

    const result = await executeMarketOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.dydx.exchange/v3/orderbook/BTC-USD',
      headers: { 'Authorization': 'Bearer test-key' },
      json: true
    });
  });

  it('should handle errors and continue on fail', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getMarkets');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeMarketOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });
});

describe('Order Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.dydx.exchange',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createOrder', () => {
		it('should create order successfully', async () => {
			const mockResponse = {
				order: {
					id: 'order-123',
					market: 'BTC-USD',
					side: 'BUY',
					type: 'LIMIT',
					size: '1.0',
					price: '50000',
					status: 'OPEN',
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createOrder')
				.mockReturnValueOnce('BTC-USD')
				.mockReturnValueOnce('BUY')
				.mockReturnValueOnce('LIMIT')
				.mockReturnValueOnce('1.0')
				.mockReturnValueOnce('50000')
				.mockReturnValueOnce('0.001')
				.mockReturnValueOnce('1234567890')
				.mockReturnValueOnce('GTT')
				.mockReturnValueOnce(false)
				.mockReturnValueOnce('client-123')
				.mockReturnValueOnce('pos-123')
				.mockReturnValueOnce('signature-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.dydx.exchange/v3/orders',
				headers: {
					'DYDX-API-KEY': 'test-key',
					'Content-Type': 'application/json',
				},
				body: {
					market: 'BTC-USD',
					side: 'BUY',
					type: 'LIMIT',
					size: '1.0',
					price: '50000',
					limitFee: '0.001',
					expiration: '1234567890',
					timeInForce: 'GTT',
					postOnly: false,
					clientId: 'client-123',
					positionId: 'pos-123',
					signature: 'signature-123',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle createOrder error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('createOrder');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getOrders', () => {
		it('should get orders successfully', async () => {
			const mockResponse = {
				orders: [
					{
						id: 'order-123',
						market: 'BTC-USD',
						side: 'BUY',
						type: 'LIMIT',
						status: 'OPEN',
					},
				],
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getOrders')
				.mockReturnValueOnce('BTC-USD')
				.mockReturnValueOnce('OPEN')
				.mockReturnValueOnce('BUY')
				.mockReturnValueOnce('LIMIT')
				.mockReturnValueOnce(100);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.dydx.exchange/v3/orders?market=BTC-USD&status=OPEN&side=BUY&type=LIMIT&limit=100',
				headers: {
					'DYDX-API-KEY': 'test-key',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getOrder', () => {
		it('should get order successfully', async () => {
			const mockResponse = {
				order: {
					id: 'order-123',
					market: 'BTC-USD',
					side: 'BUY',
					type: 'LIMIT',
					status: 'OPEN',
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getOrder')
				.mockReturnValueOnce('order-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.dydx.exchange/v3/orders/order-123',
				headers: {
					'DYDX-API-KEY': 'test-key',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('cancelOrder', () => {
		it('should cancel order successfully', async () => {
			const mockResponse = {
				cancelOrder: {
					id: 'order-123',
					status: 'CANCELED',
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('cancelOrder')
				.mockReturnValueOnce('order-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.dydx.exchange/v3/orders/order-123',
				headers: {
					'DYDX-API-KEY': 'test-key',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('cancelAllOrders', () => {
		it('should cancel all orders successfully', async () => {
			const mockResponse = {
				cancelOrders: [
					{
						id: 'order-123',
						status: 'CANCELED',
					},
				],
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('cancelAllOrders')
				.mockReturnValueOnce('BTC-USD');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.dydx.exchange/v3/orders',
				headers: {
					'DYDX-API-KEY': 'test-key',
					'Content-Type': 'application/json',
				},
				body: {
					market: 'BTC-USD',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});

describe('Position Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.dydx.exchange',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	it('should get all positions successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getPositions')
			.mockReturnValueOnce('BTC-USD')
			.mockReturnValueOnce('OPEN')
			.mockReturnValueOnce(50)
			.mockReturnValueOnce('');

		const mockResponse = {
			positions: [
				{
					id: 'pos1',
					market: 'BTC-USD',
					status: 'OPEN',
					size: '1.5',
					unrealizedPnl: '150.00',
				},
			],
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executePositionOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.dydx.exchange/v3/positions?market=BTC-USD&status=OPEN&limit=50',
			headers: {
				'DYDX-API-KEY': 'test-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should get specific position successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getPosition')
			.mockReturnValueOnce('pos123');

		const mockResponse = {
			position: {
				id: 'pos123',
				market: 'ETH-USD',
				status: 'OPEN',
				size: '10.0',
				unrealizedPnl: '500.00',
			},
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executePositionOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.dydx.exchange/v3/positions/pos123',
			headers: {
				'DYDX-API-KEY': 'test-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should get historical PnL successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getHistoricalPnl')
			.mockReturnValueOnce(25)
			.mockReturnValueOnce('')
			.mockReturnValueOnce('2023-01-01T00:00:00.000Z');

		const mockResponse = {
			historicalPnl: [
				{
					equity: '10000.00',
					totalPnl: '250.00',
					createdAt: '2023-01-01T12:00:00.000Z',
				},
			],
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executePositionOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.dydx.exchange/v3/historical-pnl?limit=25&createdOnOrAfter=2023-01-01T00:00:00.000Z',
			headers: {
				'DYDX-API-KEY': 'test-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should handle API errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getPositions')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('')
			.mockReturnValueOnce(100)
			.mockReturnValueOnce('');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const items = [{ json: {} }];
		const result = await executePositionOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	it('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		const items = [{ json: {} }];

		await expect(
			executePositionOperations.call(mockExecuteFunctions, items)
		).rejects.toThrow('Unknown operation: unknownOperation');
	});
});

describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-api-key', 
        baseUrl: 'https://api.dydx.exchange' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getAccount operation', () => {
    it('should get account information successfully', async () => {
      const mockResponse = { account: { id: '123', address: '0x123' } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccount')
        .mockReturnValueOnce('0x1234567890123456789012345678901234567890');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.dydx.exchange/v3/accounts/0x1234567890123456789012345678901234567890',
        headers: {
          'DYDX-API-KEY': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getAccount errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccount')
        .mockReturnValueOnce('0x1234567890123456789012345678901234567890');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getUser operation', () => {
    it('should get user profile successfully', async () => {
      const mockResponse = { user: { id: '123', email: 'test@example.com' } };
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getUser');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.dydx.exchange/v3/users',
        headers: {
          'DYDX-API-KEY': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('updateUser operation', () => {
    it('should update user profile successfully', async () => {
      const mockResponse = { user: { id: '123', email: 'newemail@example.com' } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateUser')
        .mockReturnValueOnce('newemail@example.com')
        .mockReturnValueOnce('newusername')
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.dydx.exchange/v3/users',
        headers: {
          'DYDX-API-KEY': 'test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          email: 'newemail@example.com',
          username: 'newusername',
          isSharingUsername: true,
          isSharingAddress: false,
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('updateEmailNotifications operation', () => {
    it('should update email notifications successfully', async () => {
      const mockResponse = { success: true };
      const preferences = { orderFills: true, transfers: false };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateEmailNotifications')
        .mockReturnValueOnce(JSON.stringify(preferences));
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.dydx.exchange/v3/users/email-notifications',
        headers: {
          'DYDX-API-KEY': 'test-api-key',
          'Content-Type': 'application/json',
        },
        body: { preferences },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle invalid JSON in preferences', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateEmailNotifications')
        .mockReturnValueOnce('invalid json');

      await expect(executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
    });
  });
});

describe('Transfer Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.dydx.exchange' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getTransfers', () => {
    it('should get transfers successfully', async () => {
      const mockResponse = { transfers: [{ id: '1', type: 'DEPOSIT', amount: '100' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransfers')
        .mockReturnValueOnce('DEPOSIT')
        .mockReturnValueOnce(50)
        .mockReturnValueOnce('');

      const result = await executeTransferOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle getTransfers error', async () => {
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTransfers');

      const result = await executeTransferOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('createWithdrawal', () => {
    it('should create withdrawal successfully', async () => {
      const mockResponse = { withdrawal: { id: '123', status: 'PENDING' } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createWithdrawal')
        .mockReturnValueOnce('100.50')
        .mockReturnValueOnce('USDC')
        .mockReturnValueOnce('client-123');

      const result = await executeTransferOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle createWithdrawal error', async () => {
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Insufficient balance'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockReturnValue('createWithdrawal');

      const result = await executeTransferOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('Insufficient balance');
    });
  });

  describe('getWithdrawals', () => {
    it('should get withdrawals successfully', async () => {
      const mockResponse = { withdrawals: [{ id: '1', amount: '50', status: 'COMPLETED' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getWithdrawals')
        .mockReturnValueOnce(25)
        .mockReturnValueOnce('2024-01-01T00:00:00Z');

      const result = await executeTransferOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle getWithdrawals error', async () => {
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Rate limit exceeded'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getWithdrawals');

      const result = await executeTransferOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('Rate limit exceeded');
    });
  });
});

describe('Funding Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.dydx.exchange',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getFundingPayments operation', () => {
		it('should get funding payments successfully', async () => {
			const mockResponse = { fundingPayments: [{ id: '1', market: 'BTC-USD', payment: '100.50' }] };
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'getFundingPayments';
					case 'market': return 'BTC-USD';
					case 'limit': return 100;
					default: return '';
				}
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeFundingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.dydx.exchange/v3/funding?market=BTC-USD&limit=100',
				headers: {
					'DYDX-API-KEY': 'test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors for getFundingPayments', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'getFundingPayments';
					case 'market': return 'BTC-USD';
					default: return '';
				}
			});
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeFundingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getHistoricalFundingRates operation', () => {
		it('should get historical funding rates successfully', async () => {
			const mockResponse = { historicalFunding: [{ market: 'BTC-USD', rate: '0.0001', effectiveAt: '2023-01-01T00:00:00Z' }] };
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'getHistoricalFundingRates';
					case 'market': return 'BTC-USD';
					case 'limit': return 100;
					default: return '';
				}
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeFundingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.dydx.exchange/v3/historical-funding/BTC-USD?limit=100',
				headers: {
					'DYDX-API-KEY': 'test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle missing market parameter for getHistoricalFundingRates', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'getHistoricalFundingRates';
					case 'market': return '';
					default: return '';
				}
			});
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeFundingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Market parameter is required for getting historical funding rates' }, pairedItem: { item: 0 } }]);
		});
	});
});

describe('ApiKey Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.dydx.exchange' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should create API key successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('createApiKey');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      apiKey: 'new-api-key-123',
      secret: 'secret-key'
    });

    const result = await executeApiKeyOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      apiKey: 'new-api-key-123',
      secret: 'secret-key'
    });
  });

  it('should get all API keys successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getApiKeys');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      apiKeys: [
        { id: 'key1', createdAt: '2023-01-01' },
        { id: 'key2', createdAt: '2023-01-02' }
      ]
    });

    const result = await executeApiKeyOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.apiKeys).toHaveLength(2);
  });

  it('should delete API key successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteApiKey')
      .mockReturnValueOnce('key-to-delete-123');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      success: true,
      message: 'API key deleted successfully'
    });

    const result = await executeApiKeyOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('createApiKey');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API rate limit exceeded'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeApiKeyOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API rate limit exceeded');
  });
});
});
