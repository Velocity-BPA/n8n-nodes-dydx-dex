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

    it('should define 12 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(12);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(12);
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
describe('Accounts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        secretKey: 'test-secret-key',
        passphrase: 'test-passphrase',
        baseUrl: 'https://api.dydx.exchange/v3',
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

  describe('getAccount operation', () => {
    it('should successfully get account by Ethereum address', async () => {
      const mockResponse = {
        account: {
          id: 'acc123',
          owner: '0x1234567890abcdef1234567890abcdef12345678',
          number: '0',
          balances: {},
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        if (name === 'operation') return 'getAccount';
        if (name === 'ethereumAddress') return '0x1234567890abcdef1234567890abcdef12345678';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/accounts?ethereumAddress='),
        })
      );
    });
  });

  describe('getAccountById operation', () => {
    it('should successfully get account by ID', async () => {
      const mockResponse = {
        account: {
          id: 'acc123',
          owner: '0x1234567890abcdef1234567890abcdef12345678',
          number: '0',
          balances: {},
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        if (name === 'operation') return 'getAccountById';
        if (name === 'accountId') return 'acc123';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/accounts/acc123'),
        })
      );
    });
  });

  describe('updateAccount operation', () => {
    it('should successfully update account', async () => {
      const updateData = { setting1: 'value1' };
      const mockResponse = {
        account: {
          id: 'acc123',
          owner: '0x1234567890abcdef1234567890abcdef12345678',
          setting1: 'value1',
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        if (name === 'operation') return 'updateAccount';
        if (name === 'accountId') return 'acc123';
        if (name === 'updateData') return updateData;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: expect.stringContaining('/accounts/acc123'),
          body: updateData,
        })
      );
    });
  });

  describe('error handling', () => {
    it('should handle API errors when continueOnFail is true', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        if (name === 'operation') return 'getAccount';
        if (name === 'ethereumAddress') return 'invalid-address';
        return undefined;
      });

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });

    it('should throw error for unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        if (name === 'operation') return 'unknownOperation';
        return undefined;
      });

      await expect(
        executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Unknown operation: unknownOperation');
    });
  });
});

describe('Orders Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        secret: 'test-secret',
        passphrase: 'test-passphrase',
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

  test('createOrder should place a new order successfully', async () => {
    const mockResponse = {
      order: {
        id: 'test-order-id',
        market: 'BTC-USD',
        side: 'BUY',
        type: 'LIMIT',
        size: '1.0',
        price: '50000',
        status: 'OPEN',
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'createOrder',
        market: 'BTC-USD',
        side: 'BUY',
        type: 'LIMIT',
        size: '1.0',
        price: '50000',
        timeInForce: 'GTC',
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://api.dydx.exchange/v3/orders',
        headers: expect.objectContaining({
          'DYDX-API-KEY': 'test-api-key',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  test('getAllOrders should retrieve orders with filters', async () => {
    const mockResponse = {
      orders: [
        {
          id: 'order-1',
          market: 'BTC-USD',
          side: 'BUY',
          status: 'OPEN',
        },
        {
          id: 'order-2',
          market: 'BTC-USD',
          side: 'SELL',
          status: 'FILLED',
        },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'getAllOrders',
        market: 'BTC-USD',
        status: 'OPEN',
        side: '',
        type: '',
        limit: 100,
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('market=BTC-USD'),
      })
    );
  });

  test('getOrder should retrieve specific order', async () => {
    const mockResponse = {
      order: {
        id: 'test-order-id',
        market: 'BTC-USD',
        side: 'BUY',
        status: 'OPEN',
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'getOrder',
        orderId: 'test-order-id',
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.dydx.exchange/v3/orders/test-order-id',
      })
    );
  });

  test('cancelOrder should cancel specific order', async () => {
    const mockResponse = {
      cancelOrder: {
        id: 'test-order-id',
        status: 'CANCELED',
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'cancelOrder',
        orderId: 'test-order-id',
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'DELETE',
        url: 'https://api.dydx.exchange/v3/orders/test-order-id',
      })
    );
  });

  test('cancelAllOrders should cancel all orders for market', async () => {
    const mockResponse = {
      cancelOrders: [
        { id: 'order-1', status: 'CANCELED' },
        { id: 'order-2', status: 'CANCELED' },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'cancelAllOrders',
        market: 'BTC-USD',
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'DELETE',
        url: expect.stringContaining('market=BTC-USD'),
      })
    );
  });

  test('should handle API errors gracefully', async () => {
    const mockError = new Error('API Error: Invalid order parameters');

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'createOrder',
        market: 'BTC-USD',
        side: 'BUY',
        type: 'LIMIT',
        size: '1.0',
        price: '50000',
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error: Invalid order parameters' });
  });
});

describe('Positions Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
        baseUrl: 'https://api.dydx.exchange/v3',
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

  describe('getAllPositions', () => {
    it('should get all positions successfully', async () => {
      const mockResponse = {
        positions: [
          {
            id: 'pos-1',
            market: 'BTC-USD',
            side: 'LONG',
            status: 'OPEN',
            size: '0.1',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllPositions')
        .mockReturnValueOnce('BTC-USD')
        .mockReturnValueOnce('OPEN');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePositionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/positions?market=BTC-USD&status=OPEN'),
        })
      );
    });

    it('should handle errors when getting all positions', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllPositions')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('OPEN');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executePositionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getPosition', () => {
    it('should get a specific position successfully', async () => {
      const mockResponse = {
        position: {
          id: 'pos-123',
          market: 'ETH-USD',
          side: 'SHORT',
          status: 'OPEN',
          size: '0.5',
        },
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPosition')
        .mockReturnValueOnce('pos-123')
        .mockReturnValueOnce('ETH-USD');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePositionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/positions/pos-123?market=ETH-USD'),
        })
      );
    });
  });

  describe('closePosition', () => {
    it('should close a position successfully', async () => {
      const mockResponse = {
        position: {
          id: 'pos-456',
          market: 'BTC-USD',
          status: 'CLOSED',
        },
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('closePosition')
        .mockReturnValueOnce('BTC-USD')
        .mockReturnValueOnce('req-123');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePositionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/positions/close'),
          body: {
            market: 'BTC-USD',
            requestId: 'req-123',
          },
        })
      );
    });
  });
});

describe('Fills Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        secret: 'test-secret',
        passphrase: 'test-passphrase',
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

  test('should get all fills successfully', async () => {
    const mockFillsResponse = {
      fills: [
        {
          id: 'fill-1',
          side: 'BUY',
          liquidity: 'TAKER',
          type: 'LIMIT',
          market: 'BTC-USD',
          orderId: 'order-1',
          price: '50000',
          size: '0.1',
          fee: '5',
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      ],
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllFills')
      .mockReturnValueOnce('BTC-USD')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockFillsResponse);

    const result = await executeFillsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockFillsResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/v3/fills'),
        headers: expect.objectContaining({
          'DYDX-API-KEY': 'test-api-key',
          'DYDX-SIGNATURE': expect.any(String),
          'DYDX-TIMESTAMP': expect.any(String),
          'DYDX-PASSPHRASE': 'test-passphrase',
        }),
      }),
    );
  });

  test('should get specific fill successfully', async () => {
    const mockFillResponse = {
      fill: {
        id: 'fill-1',
        side: 'BUY',
        liquidity: 'TAKER',
        type: 'LIMIT',
        market: 'BTC-USD',
        orderId: 'order-1',
        price: '50000',
        size: '0.1',
        fee: '5',
        createdAt: '2023-01-01T00:00:00.000Z',
      },
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getFill')
      .mockReturnValueOnce('fill-1');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockFillResponse);

    const result = await executeFillsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockFillResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/v3/fills/fill-1'),
      }),
    );
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllFills')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce('');

    const apiError = new Error('API Error');
    (apiError as any).httpCode = 400;
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    await expect(
      executeFillsOperations.call(mockExecuteFunctions, [{ json: {} }]),
    ).rejects.toThrow('API Error');
  });

  test('should continue on fail when enabled', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllFills')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeFillsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('Transfers Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        privateKey: 'test-private-key',
        passphrase: 'test-passphrase',
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

  test('createTransfer should create a transfer successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createTransfer';
        case 'type': return 'DEPOSIT';
        case 'amount': return '100.00';
        case 'asset': return 'USDC';
        default: return '';
      }
    });

    const mockResponse = {
      transfer: {
        id: 'transfer-123',
        type: 'DEPOSIT',
        amount: '100.00',
        asset: 'USDC',
        status: 'PENDING',
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTransfersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://api.dydx.exchange/v3/transfers',
        headers: expect.objectContaining({
          'DYDX-API-KEY': 'test-api-key',
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  test('getAllTransfers should fetch transfers with filters', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAllTransfers';
        case 'type': return 'DEPOSIT';
        case 'limit': return 50;
        case 'createdBeforeOrAt': return '';
        default: return '';
      }
    });

    const mockResponse = {
      transfers: [
        {
          id: 'transfer-123',
          type: 'DEPOSIT',
          amount: '100.00',
          asset: 'USDC',
          status: 'CONFIRMED',
        },
      ],
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTransfersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.dydx.exchange/v3/transfers?type=DEPOSIT&limit=50',
      }),
    );
  });

  test('getTransfer should fetch a specific transfer', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTransfer';
        case 'transferId': return 'transfer-123';
        default: return '';
      }
    });

    const mockResponse = {
      transfer: {
        id: 'transfer-123',
        type: 'WITHDRAWAL',
        amount: '50.00',
        asset: 'USDC',
        status: 'CONFIRMED',
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTransfersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.dydx.exchange/v3/transfers/transfer-123',
      }),
    );
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTransfer';
        case 'transferId': return 'invalid-id';
        default: return '';
      }
    });

    const mockError = new Error('Transfer not found');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeTransfersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      { json: { error: 'Transfer not found' }, pairedItem: { item: 0 } },
    ]);
  });
});

describe('Markets Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
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

  describe('getAllMarkets', () => {
    it('should get all markets successfully', async () => {
      const mockResponse = {
        markets: {
          'BTC-USD': {
            market: 'BTC-USD',
            status: 'ONLINE',
            baseAsset: 'BTC',
            quoteAsset: 'USD',
          },
          'ETH-USD': {
            market: 'ETH-USD',
            status: 'ONLINE',
            baseAsset: 'ETH',
            quoteAsset: 'USD',
          },
        },
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllMarkets');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeMarketsOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        { 
          json: mockResponse, 
          pairedItem: { item: 0 } 
        }
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://api.dydx.exchange/v3/markets',
          headers: expect.objectContaining({
            'DYDX-API-KEY': 'test-api-key',
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should handle getAllMarkets error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllMarkets');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('API request failed')
      );

      const items = [{ json: {} }];
      
      await expect(
        executeMarketsOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow('API request failed');
    });
  });

  describe('getMarket', () => {
    it('should get specific market successfully', async () => {
      const mockResponse = {
        market: {
          market: 'BTC-USD',
          status: 'ONLINE',
          baseAsset: 'BTC',
          quoteAsset: 'USD',
          stepSize: '0.001',
          tickSize: '1',
          indexPrice: '50000.00',
          oraclePrice: '50000.00',
        },
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getMarket')
        .mockReturnValueOnce('BTC-USD');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeMarketsOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        { 
          json: mockResponse, 
          pairedItem: { item: 0 } 
        }
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://api.dydx.exchange/v3/markets/BTC-USD',
          headers: expect.objectContaining({
            'DYDX-API-KEY': 'test-api-key',
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should handle getMarket error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getMarket')
        .mockReturnValueOnce('INVALID-MARKET');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('Market not found')
      );

      const items = [{ json: {} }];
      
      await expect(
        executeMarketsOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow('Market not found');
    });
  });

  describe('error handling', () => {
    it('should continue on fail when enabled', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllMarkets');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('Network error')
      );

      const items = [{ json: {} }];
      const result = await executeMarketsOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        { 
          json: { error: 'Network error' }, 
          pairedItem: { item: 0 } 
        }
      ]);
    });

    it('should throw error for unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('unknownOperation');

      const items = [{ json: {} }];
      
      await expect(
        executeMarketsOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow('Unknown operation: unknownOperation');
    });
  });
});

describe('Candles Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        secret: 'test-secret',
        passphrase: 'test-passphrase',
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

  describe('getCandles operation', () => {
    it('should successfully get candle data', async () => {
      const mockResponse = {
        candles: [
          {
            market: 'BTC-USD',
            resolution: '1HOUR',
            low: '45000.00',
            high: '46000.00',
            open: '45500.00',
            close: '45800.00',
            baseTokenVolume: '123.45',
            trades: 150,
            usdVolume: '5650000.00',
            startedAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T01:00:00.000Z',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getCandles';
          case 'market':
            return 'BTC-USD';
          case 'resolution':
            return '1HOUR';
          case 'limit':
            return 100;
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCandlesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/v3/candles/BTC-USD'),
          headers: expect.objectContaining({
            'DYDX-API-KEY': 'test-api-key',
            'DYDX-SIGNATURE': expect.any(String),
            'DYDX-TIMESTAMP': expect.any(String),
            'DYDX-PASSPHRASE': 'test-passphrase',
          }),
        })
      );
    });

    it('should handle API errors gracefully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getCandles';
          case 'market':
            return 'INVALID-MARKET';
          case 'resolution':
            return '1HOUR';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('Market not found')
      );
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCandlesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Market not found');
    });

    it('should include query parameters when provided', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getCandles';
          case 'market':
            return 'ETH-USD';
          case 'resolution':
            return '1DAY';
          case 'fromISO':
            return '2023-01-01T00:00:00Z';
          case 'toISO':
            return '2023-01-02T00:00:00Z';
          case 'limit':
            return 50;
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ candles: [] });

      await executeCandlesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('resolution=1DAY'),
        })
      );
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('limit=50'),
        })
      );
    });
  });
});

describe('Trades Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        secret: 'test-secret',
        passphrase: 'test-passphrase',
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

  describe('getMarketTrades', () => {
    it('should successfully get market trades', async () => {
      const mockResponse = {
        trades: [
          {
            id: '12345',
            market: 'BTC-USD',
            price: '50000.00',
            size: '0.1',
            side: 'BUY',
            createdAt: '2023-01-01T00:00:00.000Z',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getMarketTrades';
          case 'market':
            return 'BTC-USD';
          case 'limit':
            return 100;
          case 'startingBeforeOrAt':
            return '';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTradesOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/v3/trades/BTC-USD'),
          headers: expect.objectContaining({
            'DYDX-API-KEY': 'test-api-key',
            'DYDX-SIGNATURE': expect.any(String),
            'DYDX-TIMESTAMP': expect.any(String),
            'DYDX-PASSPHRASE': 'test-passphrase',
          }),
        })
      );
    });

    it('should handle API errors', async () => {
      const mockError = {
        httpCode: 400,
        message: 'Invalid market parameter',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getMarketTrades';
          case 'market':
            return 'INVALID-MARKET';
          case 'limit':
            return 100;
          case 'startingBeforeOrAt':
            return '';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      const items = [{ json: {} }];

      await expect(
        executeTradesOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow();
    });

    it('should handle errors with continueOnFail enabled', async () => {
      const mockError = new Error('Network error');

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getMarketTrades';
          case 'market':
            return 'BTC-USD';
          case 'limit':
            return 100;
          case 'startingBeforeOrAt':
            return '';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      const items = [{ json: {} }];
      const result = await executeTradesOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        {
          json: { error: 'Network error' },
          pairedItem: { item: 0 },
        },
      ]);
    });
  });
});

describe('Orderbook Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
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

  describe('getOrderbook operation', () => {
    it('should successfully get orderbook data', async () => {
      const mockOrderbookResponse = {
        orderbook: {
          bids: [
            { price: '50000.0', size: '1.5' },
            { price: '49999.0', size: '2.0' }
          ],
          asks: [
            { price: '50001.0', size: '1.2' },
            { price: '50002.0', size: '0.8' }
          ]
        }
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getOrderbook';
          case 'market':
            return 'BTC-USD';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockOrderbookResponse);

      const result = await executeOrderbookOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockOrderbookResponse);
      expect(result[0].pairedItem).toEqual({ item: 0 });
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://api.dydx.exchange/v3/orderbook/BTC-USD',
          headers: expect.objectContaining({
            'DYDX-API-KEY': 'test-api-key',
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should handle missing market parameter', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getOrderbook';
          case 'market':
            return '';
          default:
            return undefined;
        }
      });

      await expect(executeOrderbookOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects
        .toThrow('Market parameter is required');
    });

    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getOrderbook';
          case 'market':
            return 'INVALID-PAIR';
          default:
            return undefined;
        }
      });

      const apiError = {
        httpCode: '404',
        message: 'Market not found',
      };

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      await expect(executeOrderbookOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects
        .toThrow();
    });

    it('should handle continue on fail', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getOrderbook';
          case 'market':
            return 'BTC-USD';
          default:
            return undefined;
        }
      });

      const apiError = new Error('API request failed');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      const result = await executeOrderbookOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ error: 'API request failed' });
      expect(result[0].pairedItem).toEqual({ item: 0 });
    });
  });
});

describe('HistoricalPnl Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        privateKey: 'test-private-key',
        passphrase: 'test-passphrase',
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

  test('getAllHistoricalPnl should fetch historical P&L data successfully', async () => {
    const mockResponse = {
      historicalPnl: [
        {
          id: 'pnl-1',
          equity: '1000.50',
          totalPnl: '50.25',
          netTransfers: '0',
          createdAt: '2023-01-01T00:00:00.000Z',
        }
      ]
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getAllHistoricalPnl';
        case 'createdBeforeOrAt': return '2023-12-31T23:59:59.999Z';
        case 'createdOnOrAfter': return '2023-01-01T00:00:00.000Z';
        case 'limit': return 100;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeHistoricalPnlOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/v3/historical-pnl'),
        headers: expect.objectContaining({
          'DYDX-API-KEY': 'test-api-key',
          'DYDX-SIGNATURE': expect.any(String),
          'DYDX-TIMESTAMP': expect.any(String),
          'DYDX-PASSPHRASE': 'test-passphrase',
        }),
      })
    );
  });

  test('getHistoricalPnl should fetch specific P&L record successfully', async () => {
    const mockResponse = {
      historicalPnl: {
        id: 'pnl-123',
        equity: '2000.75',
        totalPnl: '100.50',
        netTransfers: '500.00',
        createdAt: '2023-01-15T12:00:00.000Z',
      }
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getHistoricalPnl';
        case 'id': return 'pnl-123';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeHistoricalPnlOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.dydx.exchange/v3/historical-pnl/pnl-123',
        headers: expect.objectContaining({
          'DYDX-API-KEY': 'test-api-key',
          'DYDX-SIGNATURE': expect.any(String),
        }),
      })
    );
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getHistoricalPnl';
        case 'id': return 'invalid-id';
        default: return undefined;
      }
    });

    const apiError = new Error('P&L record not found');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    const items = [{ json: {} }];

    await expect(
      executeHistoricalPnlOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('P&L record not found');
  });

  test('should continue on fail when configured', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getHistoricalPnl';
        case 'id': return 'invalid-id';
        default: return undefined;
      }
    });

    const apiError = new Error('Network error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    const items = [{ json: {} }];
    const result = await executeHistoricalPnlOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'Network error' });
  });
});

describe('TradingRewards Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
        passphrase: 'test-passphrase',
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

  describe('getTradingRewards', () => {
    it('should get trading rewards data successfully', async () => {
      const mockResponse = {
        rewards: [
          {
            address: '0x123...',
            weight: '100.50',
            epoch: 1,
          }
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getTradingRewards';
        if (param === 'epoch') return 1;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTradingRewardsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://api.dydx.exchange/v3/rewards/weight?epoch=1',
        })
      );
    });

    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getTradingRewards';
        if (param === 'epoch') return 1;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('API Error')
      );

      await expect(
        executeTradingRewardsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getTradingRewardsByAddress', () => {
    it('should get trading rewards by address successfully', async () => {
      const mockResponse = {
        address: '0x123456789abcdef',
        rewards: {
          weight: '250.75',
          epoch: 2,
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getTradingRewardsByAddress';
        if (param === 'address') return '0x123456789abcdef';
        if (param === 'epoch') return 2;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTradingRewardsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://api.dydx.exchange/v3/rewards/weight/0x123456789abcdef?epoch=2',
        })
      );
    });

    it('should handle continue on fail', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getTradingRewardsByAddress';
        if (param === 'address') return '0x123456789abcdef';
        return undefined;
      });

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('Network Error')
      );

      const result = await executeTradingRewardsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Network Error');
    });
  });
});

describe('LiquidityProviderRewards Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        secret: 'test-secret',
        baseUrl: 'https://api.dydx.exchange/v3',
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

  describe('getLiquidityProviderRewards', () => {
    it('should get LP rewards successfully', async () => {
      const mockResponse = {
        liquidityProviderRewards: [
          {
            address: '0x123...',
            epoch: 1,
            amount: '100.5',
            token: 'DYDX'
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getLiquidityProviderRewards';
          case 'epoch': return 1;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLiquidityProviderRewardsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/liquidity-provider-rewards?epoch=1'),
        })
      );
    });

    it('should handle errors when getting LP rewards', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getLiquidityProviderRewards';
          case 'epoch': return 1;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeLiquidityProviderRewardsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getLiquidityProviderRewardsByAddress', () => {
    it('should get LP rewards by address successfully', async () => {
      const mockResponse = {
        liquidityProviderRewards: {
          address: '0x123...',
          epoch: 1,
          amount: '100.5',
          token: 'DYDX'
        }
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getLiquidityProviderRewardsByAddress';
          case 'address': return '0x123...';
          case 'epoch': return 1;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLiquidityProviderRewardsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/liquidity-provider-rewards/0x123...?epoch=1'),
        })
      );
    });

    it('should throw error when address is missing', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getLiquidityProviderRewardsByAddress';
          case 'address': return '';
          case 'epoch': return 1;
          default: return undefined;
        }
      });

      await expect(
        executeLiquidityProviderRewardsOperations.call(
          mockExecuteFunctions,
          [{ json: {} }]
        )
      ).rejects.toThrow('Address is required');
    });
  });
});
});
