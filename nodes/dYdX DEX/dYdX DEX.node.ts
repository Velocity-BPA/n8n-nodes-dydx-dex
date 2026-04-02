/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-dydxdex/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

import * as crypto from 'crypto';
import { createHmac } from 'crypto';

export class dYdXDEX implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'dYdX DEX',
    name: 'dydxdex',
    icon: 'file:dydxdex.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the dYdX DEX API',
    defaults: {
      name: 'dYdX DEX',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'dydxdexApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Accounts',
            value: 'accounts',
          },
          {
            name: 'Orders',
            value: 'orders',
          },
          {
            name: 'Positions',
            value: 'positions',
          },
          {
            name: 'Fills',
            value: 'fills',
          },
          {
            name: 'Transfers',
            value: 'transfers',
          },
          {
            name: 'Markets',
            value: 'markets',
          },
          {
            name: 'Candles',
            value: 'candles',
          },
          {
            name: 'Trades',
            value: 'trades',
          },
          {
            name: 'Orderbook',
            value: 'orderbook',
          },
          {
            name: 'HistoricalPnl',
            value: 'historicalPnl',
          },
          {
            name: 'TradingRewards',
            value: 'tradingRewards',
          },
          {
            name: 'LiquidityProviderRewards',
            value: 'liquidityProviderRewards',
          },
          {
            name: 'Market',
            value: 'market',
          },
          {
            name: 'Order',
            value: 'order',
          },
          {
            name: 'Position',
            value: 'position',
          },
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Transfer',
            value: 'transfer',
          },
          {
            name: 'Funding',
            value: 'funding',
          },
          {
            name: 'ApiKey',
            value: 'apiKey',
          }
        ],
        default: 'accounts',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
    },
  },
  options: [
    {
      name: 'Get Account',
      value: 'getAccount',
      description: 'Get account information by Ethereum address',
      action: 'Get account information',
    },
    {
      name: 'Get Account by ID',
      value: 'getAccountById',
      description: 'Get specific account by account ID',
      action: 'Get account by ID',
    },
    {
      name: 'Update Account',
      value: 'updateAccount',
      description: 'Update account settings',
      action: 'Update account settings',
    },
  ],
  default: 'getAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['orders'],
    },
  },
  options: [
    {
      name: 'Create Order',
      value: 'createOrder',
      description: 'Place a new perpetual trading order',
      action: 'Create order',
    },
    {
      name: 'Get All Orders',
      value: 'getAllOrders',
      description: 'List orders with optional filters',
      action: 'Get all orders',
    },
    {
      name: 'Get Order',
      value: 'getOrder',
      description: 'Get specific order details by ID',
      action: 'Get order',
    },
    {
      name: 'Cancel Order',
      value: 'cancelOrder',
      description: 'Cancel an existing order by ID',
      action: 'Cancel order',
    },
    {
      name: 'Cancel All Orders',
      value: 'cancelAllOrders',
      description: 'Cancel all orders, optionally filtered by market',
      action: 'Cancel all orders',
    },
  ],
  default: 'createOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['positions'],
    },
  },
  options: [
    {
      name: 'Get All Positions',
      value: 'getAllPositions',
      description: 'Get all positions for the account',
      action: 'Get all positions',
    },
    {
      name: 'Get Position',
      value: 'getPosition',
      description: 'Get a specific position by ID',
      action: 'Get position',
    },
    {
      name: 'Close Position',
      value: 'closePosition',
      description: 'Close an existing position',
      action: 'Close position',
    },
  ],
  default: 'getAllPositions',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['fills'],
    },
  },
  options: [
    {
      name: 'Get All Fills',
      value: 'getAllFills',
      description: 'Get trade fills history',
      action: 'Get all fills',
    },
    {
      name: 'Get Fill',
      value: 'getFill',
      description: 'Get specific fill details',
      action: 'Get fill',
    },
  ],
  default: 'getAllFills',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['transfers'],
    },
  },
  options: [
    {
      name: 'Create Transfer',
      value: 'createTransfer',
      description: 'Initiate a transfer operation',
      action: 'Create transfer',
    },
    {
      name: 'Get All Transfers',
      value: 'getAllTransfers',
      description: 'List transfer history',
      action: 'Get all transfers',
    },
    {
      name: 'Get Transfer',
      value: 'getTransfer',
      description: 'Get transfer details by ID',
      action: 'Get transfer',
    },
  ],
  default: 'getAllTransfers',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['markets'],
    },
  },
  options: [
    {
      name: 'Get All Markets',
      value: 'getAllMarkets',
      description: 'Get all available markets',
      action: 'Get all markets',
    },
    {
      name: 'Get Market',
      value: 'getMarket',
      description: 'Get specific market data',
      action: 'Get market data',
    },
  ],
  default: 'getAllMarkets',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['candles'],
    },
  },
  options: [
    {
      name: 'Get Candles',
      value: 'getCandles',
      description: 'Get market candle data for historical price analysis',
      action: 'Get market candle data',
    },
  ],
  default: 'getCandles',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['trades'],
    },
  },
  options: [
    {
      name: 'Get Market Trades',
      value: 'getMarketTrades',
      description: 'Get recent trades for a specific market',
      action: 'Get market trades',
    },
  ],
  default: 'getMarketTrades',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['orderbook'],
    },
  },
  options: [
    {
      name: 'Get Orderbook',
      value: 'getOrderbook',
      description: 'Get market order book data',
      action: 'Get orderbook data',
    },
  ],
  default: 'getOrderbook',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['historicalPnl'],
    },
  },
  options: [
    {
      name: 'Get All Historical P&L',
      value: 'getAllHistoricalPnl',
      description: 'Get historical profit and loss data',
      action: 'Get all historical P&L data',
    },
    {
      name: 'Get Historical P&L',
      value: 'getHistoricalPnl',
      description: 'Get specific P&L record by ID',
      action: 'Get historical P&L record',
    },
  ],
  default: 'getAllHistoricalPnl',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['tradingRewards'],
    },
  },
  options: [
    {
      name: 'Get Trading Rewards',
      value: 'getTradingRewards',
      description: 'Get trading rewards data',
      action: 'Get trading rewards',
    },
    {
      name: 'Get Trading Rewards by Address',
      value: 'getTradingRewardsByAddress',
      description: 'Get rewards for specific address',
      action: 'Get trading rewards by address',
    },
  ],
  default: 'getTradingRewards',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['liquidityProviderRewards'],
    },
  },
  options: [
    {
      name: 'Get LP Rewards',
      value: 'getLiquidityProviderRewards',
      description: 'Get liquidity provider rewards for all addresses',
      action: 'Get LP rewards',
    },
    {
      name: 'Get LP Rewards by Address',
      value: 'getLiquidityProviderRewardsByAddress',
      description: 'Get liquidity provider rewards for a specific address',
      action: 'Get LP rewards by address',
    },
  ],
  default: 'getLiquidityProviderRewards',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['market'] } },
  options: [
    { name: 'Get Markets', value: 'getMarkets', description: 'Get all available markets', action: 'Get all markets' },
    { name: 'Get Market', value: 'getMarket', description: 'Get specific market information', action: 'Get specific market' },
    { name: 'Get Orderbook', value: 'getOrderbook', description: 'Get order book for market', action: 'Get market orderbook' },
    { name: 'Get Trades', value: 'getTrades', description: 'Get recent trades for market', action: 'Get market trades' },
    { name: 'Get Historical Funding', value: 'getHistoricalFunding', description: 'Get historical funding rates', action: 'Get historical funding rates' },
    { name: 'Get Candles', value: 'getCandles', description: 'Get OHLCV candlestick data', action: 'Get candlestick data' }
  ],
  default: 'getMarkets',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['order'],
		},
	},
	options: [
		{
			name: 'Create Order',
			value: 'createOrder',
			description: 'Create a new order',
			action: 'Create order',
		},
		{
			name: 'Get Orders',
			value: 'getOrders',
			description: 'Get all orders for account',
			action: 'Get orders',
		},
		{
			name: 'Get Order',
			value: 'getOrder',
			description: 'Get specific order by ID',
			action: 'Get order',
		},
		{
			name: 'Cancel Order',
			value: 'cancelOrder',
			description: 'Cancel specific order',
			action: 'Cancel order',
		},
		{
			name: 'Cancel All Orders',
			value: 'cancelAllOrders',
			description: 'Cancel all orders',
			action: 'Cancel all orders',
		},
	],
	default: 'createOrder',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['position'],
		},
	},
	options: [
		{
			name: 'Get All Positions',
			value: 'getPositions',
			description: 'Get all positions for account',
			action: 'Get all positions',
		},
		{
			name: 'Get Position',
			value: 'getPosition',
			description: 'Get specific position by ID',
			action: 'Get a position',
		},
		{
			name: 'Get Historical PnL',
			value: 'getHistoricalPnl',
			description: 'Get historical profit and loss',
			action: 'Get historical profit and loss',
		},
	],
	default: 'getPositions',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'Get Account', value: 'getAccount', description: 'Get account information by Ethereum address', action: 'Get account information' },
    { name: 'Get User', value: 'getUser', description: 'Get user profile information', action: 'Get user profile information' },
    { name: 'Update User', value: 'updateUser', description: 'Update user profile', action: 'Update user profile' },
    { name: 'Update Email Notifications', value: 'updateEmailNotifications', description: 'Update email notification preferences', action: 'Update email notification preferences' }
  ],
  default: 'getAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transfer'] } },
  options: [
    { name: 'Get Transfers', value: 'getTransfers', description: 'Get transfer history', action: 'Get transfer history' },
    { name: 'Create Withdrawal', value: 'createWithdrawal', description: 'Create withdrawal request', action: 'Create withdrawal request' },
    { name: 'Get Withdrawals', value: 'getWithdrawals', description: 'Get withdrawal history', action: 'Get withdrawal history' },
  ],
  default: 'getTransfers',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['funding'],
		},
	},
	options: [
		{
			name: 'Get Funding Payments',
			value: 'getFundingPayments',
			description: 'Get funding payment history',
			action: 'Get funding payments',
		},
		{
			name: 'Get Historical Funding Rates',
			value: 'getHistoricalFundingRates',
			description: 'Get historical funding rates for a market',
			action: 'Get historical funding rates',
		},
	],
	default: 'getFundingPayments',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['apiKey'] } },
  options: [
    { name: 'Create API Key', value: 'createApiKey', description: 'Create new API key', action: 'Create API key' },
    { name: 'Get API Keys', value: 'getApiKeys', description: 'Get all API keys for account', action: 'Get API keys' },
    { name: 'Delete API Key', value: 'deleteApiKey', description: 'Delete API key', action: 'Delete API key' }
  ],
  default: 'createApiKey',
},
      // Parameter definitions
{
  displayName: 'Ethereum Address',
  name: 'ethereumAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccount'],
    },
  },
  default: '',
  description: 'The Ethereum address of the account to retrieve',
  placeholder: '0x...',
},
{
  displayName: 'Account ID',
  name: 'accountId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountById', 'updateAccount'],
    },
  },
  default: '',
  description: 'The unique account ID',
},
{
  displayName: 'Update Data',
  name: 'updateData',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['updateAccount'],
    },
  },
  default: '{}',
  description: 'JSON object containing the account data to update',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder'],
    },
  },
  default: 'BTC-USD',
  description: 'The trading pair (e.g., BTC-USD, ETH-USD)',
},
{
  displayName: 'Side',
  name: 'side',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder'],
    },
  },
  options: [
    {
      name: 'Buy',
      value: 'BUY',
    },
    {
      name: 'Sell',
      value: 'SELL',
    },
  ],
  default: 'BUY',
  description: 'Order side - buy or sell',
},
{
  displayName: 'Order Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder'],
    },
  },
  options: [
    {
      name: 'Market',
      value: 'MARKET',
    },
    {
      name: 'Limit',
      value: 'LIMIT',
    },
    {
      name: 'Stop',
      value: 'STOP',
    },
    {
      name: 'Stop Limit',
      value: 'STOP_LIMIT',
    },
  ],
  default: 'LIMIT',
  description: 'Type of order to place',
},
{
  displayName: 'Size',
  name: 'size',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder'],
    },
  },
  default: '',
  description: 'Size of the order in base currency',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder'],
      type: ['LIMIT', 'STOP_LIMIT'],
    },
  },
  default: '',
  description: 'Price per unit in quote currency (required for limit orders)',
},
{
  displayName: 'Time In Force',
  name: 'timeInForce',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder'],
    },
  },
  options: [
    {
      name: 'Good Till Canceled',
      value: 'GTC',
    },
    {
      name: 'Fill or Kill',
      value: 'FOK',
    },
    {
      name: 'Immediate or Cancel',
      value: 'IOC',
    },
  ],
  default: 'GTC',
  description: 'Time in force policy for the order',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['getAllOrders'],
    },
  },
  default: '',
  description: 'Filter orders by market (e.g., BTC-USD)',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['getAllOrders'],
    },
  },
  options: [
    {
      name: 'Open',
      value: 'OPEN',
    },
    {
      name: 'Filled',
      value: 'FILLED',
    },
    {
      name: 'Canceled',
      value: 'CANCELED',
    },
    {
      name: 'Best Effort Canceled',
      value: 'BEST_EFFORT_CANCELED',
    },
  ],
  default: 'OPEN',
  description: 'Filter orders by status',
},
{
  displayName: 'Side',
  name: 'side',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['getAllOrders'],
    },
  },
  options: [
    {
      name: 'Buy',
      value: 'BUY',
    },
    {
      name: 'Sell',
      value: 'SELL',
    },
  ],
  default: '',
  description: 'Filter orders by side',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['getAllOrders'],
    },
  },
  options: [
    {
      name: 'Market',
      value: 'MARKET',
    },
    {
      name: 'Limit',
      value: 'LIMIT',
    },
    {
      name: 'Stop',
      value: 'STOP',
    },
    {
      name: 'Stop Limit',
      value: 'STOP_LIMIT',
    },
  ],
  default: '',
  description: 'Filter orders by type',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['getAllOrders'],
    },
  },
  default: 100,
  description: 'Maximum number of orders to return',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['getOrder', 'cancelOrder'],
    },
  },
  default: '',
  description: 'The unique identifier of the order',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['cancelAllOrders'],
    },
  },
  default: '',
  description: 'Cancel all orders for specific market only',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['positions'],
      operation: ['getAllPositions'],
    },
  },
  default: '',
  description: 'Filter positions by market (e.g., BTC-USD)',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['positions'],
      operation: ['getAllPositions'],
    },
  },
  options: [
    {
      name: 'Open',
      value: 'OPEN',
    },
    {
      name: 'Closed',
      value: 'CLOSED',
    },
    {
      name: 'Liquidated',
      value: 'LIQUIDATED',
    },
  ],
  default: 'OPEN',
  description: 'Filter positions by status',
},
{
  displayName: 'Position ID',
  name: 'positionId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['positions'],
      operation: ['getPosition'],
    },
  },
  default: '',
  description: 'The unique identifier for the position',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['positions'],
      operation: ['getPosition'],
    },
  },
  default: '',
  description: 'Filter by market (e.g., BTC-USD)',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['positions'],
      operation: ['closePosition'],
    },
  },
  default: '',
  description: 'The market for the position to close (e.g., BTC-USD)',
},
{
  displayName: 'Request ID',
  name: 'requestId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['positions'],
      operation: ['closePosition'],
    },
  },
  default: '',
  description: 'Unique request identifier for idempotency',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['fills'],
      operation: ['getAllFills'],
    },
  },
  default: '',
  description: 'The market to filter fills by (e.g., BTC-USD)',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['fills'],
      operation: ['getAllFills'],
    },
  },
  default: '',
  description: 'The order ID to filter fills by',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['fills'],
      operation: ['getAllFills'],
    },
  },
  default: 100,
  description: 'Maximum number of fills to return',
  typeOptions: {
    minValue: 1,
    maxValue: 100,
  },
},
{
  displayName: 'Created Before Or At',
  name: 'createdBeforeOrAt',
  type: 'dateTime',
  required: false,
  displayOptions: {
    show: {
      resource: ['fills'],
      operation: ['getAllFills'],
    },
  },
  default: '',
  description: 'Get fills created before or at this ISO timestamp',
},
{
  displayName: 'Fill ID',
  name: 'fillId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fills'],
      operation: ['getFill'],
    },
  },
  default: '',
  description: 'The unique identifier of the fill to retrieve',
},
{
  displayName: 'Transfer Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['transfers'],
      operation: ['createTransfer'],
    },
  },
  options: [
    {
      name: 'Deposit',
      value: 'DEPOSIT',
    },
    {
      name: 'Withdrawal',
      value: 'WITHDRAWAL',
    },
    {
      name: 'Fast Withdrawal',
      value: 'FAST_WITHDRAWAL',
    },
  ],
  default: 'DEPOSIT',
  description: 'The type of transfer to create',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transfers'],
      operation: ['createTransfer'],
    },
  },
  default: '',
  description: 'The amount to transfer',
},
{
  displayName: 'Asset',
  name: 'asset',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transfers'],
      operation: ['createTransfer'],
    },
  },
  default: 'USDC',
  description: 'The asset to transfer',
},
{
  displayName: 'Transfer Type Filter',
  name: 'type',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['transfers'],
      operation: ['getAllTransfers'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'Deposit',
      value: 'DEPOSIT',
    },
    {
      name: 'Withdrawal',
      value: 'WITHDRAWAL',
    },
    {
      name: 'Fast Withdrawal',
      value: 'FAST_WITHDRAWAL',
    },
  ],
  default: '',
  description: 'Filter transfers by type',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transfers'],
      operation: ['getAllTransfers'],
    },
  },
  default: 100,
  description: 'Maximum number of transfers to return',
},
{
  displayName: 'Created Before Or At',
  name: 'createdBeforeOrAt',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transfers'],
      operation: ['getAllTransfers'],
    },
  },
  default: '',
  description: 'Return transfers created before or at this ISO timestamp',
},
{
  displayName: 'Transfer ID',
  name: 'transferId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transfers'],
      operation: ['getTransfer'],
    },
  },
  default: '',
  description: 'The ID of the transfer to retrieve',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['markets'],
      operation: ['getMarket'],
    },
  },
  default: '',
  description: 'The market identifier (e.g., BTC-USD, ETH-USD)',
  placeholder: 'BTC-USD',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['candles'],
      operation: ['getCandles'],
    },
  },
  default: '',
  placeholder: 'BTC-USD',
  description: 'The market to get candle data for (e.g., BTC-USD, ETH-USD)',
},
{
  displayName: 'Resolution',
  name: 'resolution',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['candles'],
      operation: ['getCandles'],
    },
  },
  options: [
    {
      name: '1 Minute',
      value: '1MIN',
    },
    {
      name: '5 Minutes',
      value: '5MINS',
    },
    {
      name: '15 Minutes',
      value: '15MINS',
    },
    {
      name: '30 Minutes',
      value: '30MINS',
    },
    {
      name: '1 Hour',
      value: '1HOUR',
    },
    {
      name: '4 Hours',
      value: '4HOURS',
    },
    {
      name: '1 Day',
      value: '1DAY',
    },
  ],
  default: '1HOUR',
  description: 'The time resolution for each candle',
},
{
  displayName: 'From Date (ISO)',
  name: 'fromISO',
  type: 'dateTime',
  required: false,
  displayOptions: {
    show: {
      resource: ['candles'],
      operation: ['getCandles'],
    },
  },
  default: '',
  description: 'Start date for historical data in ISO format',
},
{
  displayName: 'To Date (ISO)',
  name: 'toISO',
  type: 'dateTime',
  required: false,
  displayOptions: {
    show: {
      resource: ['candles'],
      operation: ['getCandles'],
    },
  },
  default: '',
  description: 'End date for historical data in ISO format',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['candles'],
      operation: ['getCandles'],
    },
  },
  default: 100,
  typeOptions: {
    minValue: 1,
    maxValue: 100,
  },
  description: 'Maximum number of candles to return (1-100)',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['trades'],
      operation: ['getMarketTrades'],
    },
  },
  default: '',
  description: 'The market to get trades for (e.g., BTC-USD, ETH-USD)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['trades'],
      operation: ['getMarketTrades'],
    },
  },
  default: 100,
  description: 'The maximum number of trades to return (default: 100)',
  typeOptions: {
    minValue: 1,
    maxValue: 1000,
  },
},
{
  displayName: 'Starting Before Or At',
  name: 'startingBeforeOrAt',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['trades'],
      operation: ['getMarketTrades'],
    },
  },
  default: '',
  description: 'ISO timestamp to get trades before or at this time',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['orderbook'],
      operation: ['getOrderbook'],
    },
  },
  default: '',
  description: 'The trading pair (e.g., BTC-USD, ETH-USD)',
  placeholder: 'BTC-USD',
},
{
  displayName: 'Created Before Or At',
  name: 'createdBeforeOrAt',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['historicalPnl'],
      operation: ['getAllHistoricalPnl'],
    },
  },
  default: '',
  description: 'ISO timestamp to filter records created before or at this time',
},
{
  displayName: 'Created On Or After',
  name: 'createdOnOrAfter',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['historicalPnl'],
      operation: ['getAllHistoricalPnl'],
    },
  },
  default: '',
  description: 'ISO timestamp to filter records created on or after this time',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['historicalPnl'],
      operation: ['getAllHistoricalPnl'],
    },
  },
  default: 100,
  description: 'Maximum number of records to return',
},
{
  displayName: 'P&L ID',
  name: 'id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['historicalPnl'],
      operation: ['getHistoricalPnl'],
    },
  },
  default: '',
  description: 'The ID of the historical P&L record to retrieve',
},
{
  displayName: 'Epoch',
  name: 'epoch',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['tradingRewards'],
      operation: ['getTradingRewards'],
    },
  },
  default: 0,
  description: 'The epoch number for rewards data',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tradingRewards'],
      operation: ['getTradingRewardsByAddress'],
    },
  },
  default: '',
  description: 'The wallet address to get rewards for',
},
{
  displayName: 'Epoch',
  name: 'epoch',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['tradingRewards'],
      operation: ['getTradingRewardsByAddress'],
    },
  },
  default: 0,
  description: 'The epoch number for rewards data',
},
{
  displayName: 'Epoch',
  name: 'epoch',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['liquidityProviderRewards'],
      operation: ['getLiquidityProviderRewards'],
    },
  },
  default: 0,
  description: 'The epoch number for which to retrieve rewards',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['liquidityProviderRewards'],
      operation: ['getLiquidityProviderRewardsByAddress'],
    },
  },
  default: '',
  description: 'The Ethereum address of the liquidity provider',
},
{
  displayName: 'Epoch',
  name: 'epoch',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['liquidityProviderRewards'],
      operation: ['getLiquidityProviderRewardsByAddress'],
    },
  },
  default: 0,
  description: 'The epoch number for which to retrieve rewards',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['market'],
      operation: ['getMarket', 'getOrderbook', 'getTrades', 'getHistoricalFunding', 'getCandles']
    }
  },
  default: '',
  placeholder: 'BTC-USD',
  description: 'The market symbol (e.g., BTC-USD)'
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['market'],
      operation: ['getTrades', 'getCandles']
    }
  },
  default: 100,
  description: 'Maximum number of results to return'
},
{
  displayName: 'Effective Before Or At',
  name: 'effectiveBeforeOrAt',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['market'],
      operation: ['getHistoricalFunding']
    }
  },
  default: '',
  placeholder: '2023-01-01T00:00:00.000Z',
  description: 'ISO timestamp to get funding rates before or at this time'
},
{
  displayName: 'Resolution',
  name: 'resolution',
  type: 'options',
  options: [
    { name: '1 Minute', value: '1MIN' },
    { name: '5 Minutes', value: '5MINS' },
    { name: '15 Minutes', value: '15MINS' },
    { name: '30 Minutes', value: '30MINS' },
    { name: '1 Hour', value: '1HOUR' },
    { name: '4 Hours', value: '4HOURS' },
    { name: '1 Day', value: '1DAY' }
  ],
  displayOptions: {
    show: {
      resource: ['market'],
      operation: ['getCandles']
    }
  },
  default: '1HOUR',
  description: 'The time resolution for candle data'
},
{
  displayName: 'From ISO',
  name: 'fromISO',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['market'],
      operation: ['getCandles']
    }
  },
  default: '',
  placeholder: '2023-01-01T00:00:00.000Z',
  description: 'ISO timestamp for the start of the candle data range'
},
{
  displayName: 'To ISO',
  name: 'toISO',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['market'],
      operation: ['getCandles']
    }
  },
  default: '',
  placeholder: '2023-01-02T00:00:00.000Z',
  description: 'ISO timestamp for the end of the candle data range'
},
{
	displayName: 'Market',
	name: 'market',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	default: '',
	placeholder: 'BTC-USD',
	description: 'The market to trade in',
},
{
	displayName: 'Side',
	name: 'side',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	options: [
		{
			name: 'Buy',
			value: 'BUY',
		},
		{
			name: 'Sell',
			value: 'SELL',
		},
	],
	default: 'BUY',
	description: 'Order side',
},
{
	displayName: 'Type',
	name: 'type',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	options: [
		{
			name: 'Market',
			value: 'MARKET',
		},
		{
			name: 'Limit',
			value: 'LIMIT',
		},
		{
			name: 'Stop',
			value: 'STOP',
		},
		{
			name: 'Stop Limit',
			value: 'STOP_LIMIT',
		},
	],
	default: 'LIMIT',
	description: 'Order type',
},
{
	displayName: 'Size',
	name: 'size',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	default: '',
	description: 'Size of the order',
},
{
	displayName: 'Price',
	name: 'price',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	default: '',
	description: 'Price of the order (required for limit orders)',
},
{
	displayName: 'Limit Fee',
	name: 'limitFee',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	default: '',
	description: 'Limit fee for the order',
},
{
	displayName: 'Expiration',
	name: 'expiration',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	default: '',
	description: 'Order expiration timestamp',
},
{
	displayName: 'Time In Force',
	name: 'timeInForce',
	type: 'options',
	required: false,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	options: [
		{
			name: 'Good Till Canceled',
			value: 'GTT',
		},
		{
			name: 'Fill or Kill',
			value: 'FOK',
		},
		{
			name: 'Immediate or Cancel',
			value: 'IOC',
		},
	],
	default: 'GTT',
	description: 'Time in force for the order',
},
{
	displayName: 'Post Only',
	name: 'postOnly',
	type: 'boolean',
	required: false,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	default: false,
	description: 'Whether the order is post-only',
},
{
	displayName: 'Client ID',
	name: 'clientId',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	default: '',
	description: 'Client-specified order ID',
},
{
	displayName: 'Position ID',
	name: 'positionId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	default: '',
	description: 'Position ID for position management',
},
{
	displayName: 'Signature',
	name: 'signature',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	default: '',
	description: 'STARK key cryptographic signature',
},
{
	displayName: 'Market',
	name: 'market',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['getOrders'],
		},
	},
	default: '',
	description: 'Filter orders by market',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	required: false,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['getOrders'],
		},
	},
	options: [
		{
			name: 'Open',
			value: 'OPEN',
		},
		{
			name: 'Filled',
			value: 'FILLED',
		},
		{
			name: 'Canceled',
			value: 'CANCELED',
		},
		{
			name: 'Pending',
			value: 'PENDING',
		},
	],
	default: '',
	description: 'Filter orders by status',
},
{
	displayName: 'Side',
	name: 'side',
	type: 'options',
	required: false,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['getOrders'],
		},
	},
	options: [
		{
			name: 'Buy',
			value: 'BUY',
		},
		{
			name: 'Sell',
			value: 'SELL',
		},
	],
	default: '',
	description: 'Filter orders by side',
},
{
	displayName: 'Type',
	name: 'type',
	type: 'options',
	required: false,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['getOrders'],
		},
	},
	options: [
		{
			name: 'Market',
			value: 'MARKET',
		},
		{
			name: 'Limit',
			value: 'LIMIT',
		},
		{
			name: 'Stop',
			value: 'STOP',
		},
		{
			name: 'Stop Limit',
			value: 'STOP_LIMIT',
		},
	],
	default: '',
	description: 'Filter orders by type',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['getOrders'],
		},
	},
	default: 100,
	description: 'Maximum number of orders to return',
},
{
	displayName: 'Order ID',
	name: 'orderId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['getOrder', 'cancelOrder'],
		},
	},
	default: '',
	description: 'ID of the order',
},
{
	displayName: 'Market',
	name: 'market',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['cancelAllOrders'],
		},
	},
	default: '',
	description: 'Cancel orders only for this market (optional)',
},
{
	displayName: 'Position ID',
	name: 'positionId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['position'],
			operation: ['getPosition'],
		},
	},
	default: '',
	description: 'The unique identifier of the position to retrieve',
},
{
	displayName: 'Market',
	name: 'market',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['position'],
			operation: ['getPositions'],
		},
	},
	default: '',
	description: 'Filter positions by market (e.g., BTC-USD)',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	options: [
		{
			name: 'Open',
			value: 'OPEN',
		},
		{
			name: 'Closed',
			value: 'CLOSED',
		},
		{
			name: 'Liquidated',
			value: 'LIQUIDATED',
		},
	],
	displayOptions: {
		show: {
			resource: ['position'],
			operation: ['getPositions'],
		},
	},
	default: '',
	description: 'Filter positions by status',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	typeOptions: {
		minValue: 1,
		maxValue: 100,
	},
	displayOptions: {
		show: {
			resource: ['position'],
			operation: ['getPositions', 'getHistoricalPnl'],
		},
	},
	default: 100,
	description: 'Maximum number of results to return',
},
{
	displayName: 'Created Before Or At',
	name: 'createdBeforeOrAt',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['position'],
			operation: ['getPositions', 'getHistoricalPnl'],
		},
	},
	default: '',
	description: 'Filter results created before or at this timestamp',
},
{
	displayName: 'Created On Or After',
	name: 'createdOnOrAfter',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['position'],
			operation: ['getHistoricalPnl'],
		},
	},
	default: '',
	description: 'Filter results created on or after this timestamp',
},
{
  displayName: 'Ethereum Address',
  name: 'ethereumAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getAccount'] } },
  default: '',
  description: 'The Ethereum address of the account to retrieve'
},
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['updateUser'] } },
  default: '',
  description: 'User email address'
},
{
  displayName: 'Username',
  name: 'username',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['updateUser'] } },
  default: '',
  description: 'Username for the user profile'
},
{
  displayName: 'Is Sharing Username',
  name: 'isSharingUsername',
  type: 'boolean',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['updateUser'] } },
  default: false,
  description: 'Whether to share username publicly'
},
{
  displayName: 'Is Sharing Address',
  name: 'isSharingAddress',
  type: 'boolean',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['updateUser'] } },
  default: false,
  description: 'Whether to share Ethereum address publicly'
},
{
  displayName: 'Preferences',
  name: 'preferences',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['updateEmailNotifications'] } },
  default: '{}',
  description: 'Email notification preferences as JSON object'
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  displayOptions: { show: { resource: ['transfer'], operation: ['getTransfers'] } },
  options: [
    { name: 'All', value: '' },
    { name: 'Deposit', value: 'DEPOSIT' },
    { name: 'Withdrawal', value: 'WITHDRAWAL' },
    { name: 'Transfer In', value: 'TRANSFER_IN' },
    { name: 'Transfer Out', value: 'TRANSFER_OUT' },
  ],
  default: '',
  description: 'Filter transfers by type',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['transfer'], operation: ['getTransfers', 'getWithdrawals'] } },
  default: 100,
  description: 'Number of results to return (max 100)',
  typeOptions: { minValue: 1, maxValue: 100 },
},
{
  displayName: 'Created Before Or At',
  name: 'createdBeforeOrAt',
  type: 'dateTime',
  displayOptions: { show: { resource: ['transfer'], operation: ['getTransfers', 'getWithdrawals'] } },
  default: '',
  description: 'Return transfers created before or at this timestamp',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transfer'], operation: ['createWithdrawal'] } },
  default: '',
  description: 'Amount to withdraw',
},
{
  displayName: 'Asset',
  name: 'asset',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['transfer'], operation: ['createWithdrawal'] } },
  options: [
    { name: 'USD Coin', value: 'USDC' },
    { name: 'Ethereum', value: 'ETH' },
    { name: 'Bitcoin', value: 'BTC' },
  ],
  default: 'USDC',
  description: 'Asset to withdraw',
},
{
  displayName: 'Client ID',
  name: 'clientId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transfer'], operation: ['createWithdrawal'] } },
  default: '',
  description: 'Unique client ID for the withdrawal',
},
{
	displayName: 'Market',
	name: 'market',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['funding'],
			operation: ['getFundingPayments', 'getHistoricalFundingRates'],
		},
	},
	default: '',
	description: 'The market to get funding data for (e.g., BTC-USD)',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['funding'],
			operation: ['getFundingPayments', 'getHistoricalFundingRates'],
		},
	},
	default: 100,
	description: 'Maximum number of records to return',
},
{
	displayName: 'Effective Before Or At',
	name: 'effectiveBeforeOrAt',
	type: 'dateTime',