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
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'accounts':
        return [await executeAccountsOperations.call(this, items)];
      case 'orders':
        return [await executeOrdersOperations.call(this, items)];
      case 'positions':
        return [await executePositionsOperations.call(this, items)];
      case 'fills':
        return [await executeFillsOperations.call(this, items)];
      case 'transfers':
        return [await executeTransfersOperations.call(this, items)];
      case 'markets':
        return [await executeMarketsOperations.call(this, items)];
      case 'candles':
        return [await executeCandlesOperations.call(this, items)];
      case 'trades':
        return [await executeTradesOperations.call(this, items)];
      case 'orderbook':
        return [await executeOrderbookOperations.call(this, items)];
      case 'historicalPnl':
        return [await executeHistoricalPnlOperations.call(this, items)];
      case 'tradingRewards':
        return [await executeTradingRewardsOperations.call(this, items)];
      case 'liquidityProviderRewards':
        return [await executeLiquidityProviderRewardsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

function createHmacSignature(secret: string, message: string): string {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

function createISOTimestamp(): string {
  return new Date().toISOString();
}

function createSignedHeaders(credentials: any, method: string, requestPath: string, body?: string): any {
  const timestamp = createISOTimestamp();
  const bodyString = body || '';
  const message = timestamp + method + requestPath + bodyString;
  const signature = createHmacSignature(credentials.secretKey, message);
  
  return {
    'DYDX-API-KEY': credentials.apiKey,
    'DYDX-SIGNATURE': signature,
    'DYDX-TIMESTAMP': timestamp,
    'DYDX-PASSPHRASE': credentials.passphrase,
    'Content-Type': 'application/json',
  };
}

async function executeAccountsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dydxdexApi') as any;
  const baseUrl = credentials.baseUrl || 'https://api.dydx.exchange/v3';

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getAccount': {
          const ethereumAddress = this.getNodeParameter('ethereumAddress', i) as string;
          const requestPath = `/accounts?ethereumAddress=${ethereumAddress}`;
          
          const options: any = {
            method: 'GET',
            url: baseUrl + requestPath,
            headers: createSignedHeaders(credentials, 'GET', requestPath),
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAccountById': {
          const accountId = this.getNodeParameter('accountId', i) as string;
          const requestPath = `/accounts/${accountId}`;
          
          const options: any = {
            method: 'GET',
            url: baseUrl + requestPath,
            headers: createSignedHeaders(credentials, 'GET', requestPath),
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'updateAccount': {
          const accountId = this.getNodeParameter('accountId', i) as string;
          const updateData = this.getNodeParameter('updateData', i) as any;
          const requestPath = `/accounts/${accountId}`;
          const bodyString = JSON.stringify(updateData);
          
          const options: any = {
            method: 'PUT',
            url: baseUrl + requestPath,
            headers: createSignedHeaders(credentials, 'PUT', requestPath, bodyString),
            body: updateData,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }
  
  return returnData;
}

function createSignature(secret: string, timestamp: string, method: string, requestPath: string, body: string): string {
  const message = timestamp + method + requestPath + body;
  return createHmac('sha256', secret).update(message).digest('base64');
}

function createHeaders(credentials: any, method: string, requestPath: string, body: string = ''): any {
  const timestamp = new Date().toISOString();
  const signature = createSignature(credentials.secret, timestamp, method, requestPath, body);
  
  return {
    'DYDX-API-KEY': credentials.apiKey,
    'DYDX-SIGNATURE': signature,
    'DYDX-TIMESTAMP': timestamp,
    'DYDX-PASSPHRASE': credentials.passphrase,
    'Content-Type': 'application/json',
  };
}

async function executeOrdersOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dydxdexApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'createOrder': {
          const market = this.getNodeParameter('market', i) as string;
          const side = this.getNodeParameter('side', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const size = this.getNodeParameter('size', i) as string;
          const price = this.getNodeParameter('price', i, '') as string;
          const timeInForce = this.getNodeParameter('timeInForce', i, 'GTC') as string;
          
          const body: any = {
            market,
            side,
            type,
            size,
            timeInForce,
          };
          
          if (price && (type === 'LIMIT' || type === 'STOP_LIMIT')) {
            body.price = price;
          }
          
          const bodyString = JSON.stringify(body);
          const requestPath = '/v3/orders';
          const headers = createHeaders(credentials, 'POST', requestPath, bodyString);
          
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + requestPath,
            headers,
            body: bodyString,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAllOrders': {
          const market = this.getNodeParameter('market', i, '') as string;
          const status = this.getNodeParameter('status', i, '') as string;
          const side = this.getNodeParameter('side', i, '') as string;
          const type = this.getNodeParameter('type', i, '') as string;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          
          const queryParams = new URLSearchParams();
          if (market) queryParams.append('market', market);
          if (status) queryParams.append('status', status);
          if (side) queryParams.append('side', side);
          if (type) queryParams.append('type', type);
          if (limit) queryParams.append('limit', limit.toString());
          
          const requestPath = '/v3/orders' + (queryParams.toString() ? '?' + queryParams.toString() : '');
          const headers = createHeaders(credentials, 'GET', requestPath);
          
          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + requestPath,
            headers,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const requestPath = `/v3/orders/${orderId}`;
          const headers = createHeaders(credentials, 'GET', requestPath);
          
          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + requestPath,
            headers,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'cancelOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const requestPath = `/v3/orders/${orderId}`;
          const headers = createHeaders(credentials, 'DELETE', requestPath);
          
          const options: any = {
            method: 'DELETE',
            url: credentials.baseUrl + requestPath,
            headers,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'cancelAllOrders': {
          const market = this.getNodeParameter('market', i, '') as string;
          
          const queryParams = new URLSearchParams();
          if (market) queryParams.append('market', market);
          
          const requestPath = '/v3/orders' + (queryParams.toString() ? '?' + queryParams.toString() : '');
          const headers = createHeaders(credentials, 'DELETE', requestPath);
          
          const options: any = {
            method: 'DELETE',
            url: credentials.baseUrl + requestPath,
            headers,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }
  
  return returnData;
}

function createSignature(message: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

function createTimestamp(): string {
  return new Date().toISOString();
}

async function executePositionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dydxdexApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const timestamp = createTimestamp();
      
      switch (operation) {
        case 'getAllPositions': {
          const market = this.getNodeParameter('market', i, '') as string;
          const status = this.getNodeParameter('status', i, 'OPEN') as string;
          
          let url = `${credentials.baseUrl}/positions`;
          const queryParams: string[] = [];
          
          if (market) {
            queryParams.push(`market=${encodeURIComponent(market)}`);
          }
          if (status) {
            queryParams.push(`status=${encodeURIComponent(status)}`);
          }
          
          if (queryParams.length > 0) {
            url += '?' + queryParams.join('&');
          }
          
          const message = timestamp + 'GET' + '/v3/positions' + (queryParams.length > 0 ? '?' + queryParams.join('&') : '');
          const signature = createSignature(message, credentials.apiSecret);
          
          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-SIGNATURE': signature,
              'DYDX-TIMESTAMP': timestamp,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getPosition': {
          const positionId = this.getNodeParameter('positionId', i) as string;
          const market = this.getNodeParameter('market', i, '') as string;
          
          let url = `${credentials.baseUrl}/positions/${positionId}`;
          const queryParams: string[] = [];
          
          if (market) {
            queryParams.push(`market=${encodeURIComponent(market)}`);
          }
          
          if (queryParams.length > 0) {
            url += '?' + queryParams.join('&');
          }
          
          const message = timestamp + 'GET' + `/v3/positions/${positionId}` + (queryParams.length > 0 ? '?' + queryParams.join('&') : '');
          const signature = createSignature(message, credentials.apiSecret);
          
          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-SIGNATURE': signature,
              'DYDX-TIMESTAMP': timestamp,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'closePosition': {
          const market = this.getNodeParameter('market', i) as string;
          const requestId = this.getNodeParameter('requestId', i, '') as string;
          
          const body: any = {
            market: market,
          };
          
          if (requestId) {
            body.requestId = requestId;
          }
          
          const bodyString = JSON.stringify(body);
          const message = timestamp + 'POST' + '/v3/positions/close' + bodyString;
          const signature = createSignature(message, credentials.apiSecret);
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/positions/close`,
            headers: {
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-SIGNATURE': signature,
              'DYDX-TIMESTAMP': timestamp,
              'Content-Type': 'application/json',
            },
            body: body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }
  
  return returnData;
}

function createSignature(secret: string, method: string, path: string, body: string, timestamp: string): string {
  const message = timestamp + method + path + body;
  return createHmac('sha256', secret).update(message).digest('hex');
}

async function executeFillsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dydxdexApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllFills': {
          const market = this.getNodeParameter('market', i) as string;
          const orderId = this.getNodeParameter('orderId', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const createdBeforeOrAt = this.getNodeParameter('createdBeforeOrAt', i) as string;

          const queryParams: any = {};
          if (market) queryParams.market = market;
          if (orderId) queryParams.orderId = orderId;
          if (limit) queryParams.limit = limit.toString();
          if (createdBeforeOrAt) queryParams.createdBeforeOrAt = new Date(createdBeforeOrAt).toISOString();

          const queryString = new URLSearchParams(queryParams).toString();
          const path = '/v3/fills' + (queryString ? `?${queryString}` : '');
          const timestamp = Date.now().toString();
          const signature = createSignature(credentials.secret, 'GET', path, '', timestamp);

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + path,
            headers: {
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-SIGNATURE': signature,
              'DYDX-TIMESTAMP': timestamp,
              'DYDX-PASSPHRASE': credentials.passphrase,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFill': {
          const fillId = this.getNodeParameter('fillId', i) as string;
          const path = `/v3/fills/${fillId}`;
          const timestamp = Date.now().toString();
          const signature = createSignature(credentials.secret, 'GET', path, '', timestamp);

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + path,
            headers: {
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-SIGNATURE': signature,
              'DYDX-TIMESTAMP': timestamp,
              'DYDX-PASSPHRASE': credentials.passphrase,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeTransfersOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dydxdexApi') as any;

  function createSignature(
    timestamp: string,
    method: string,
    requestPath: string,
    body: string = '',
  ): string {
    const message = timestamp + method + requestPath + body;
    return crypto
      .createHmac('sha256', credentials.privateKey)
      .update(message)
      .digest('hex');
  }

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const timestamp = new Date().toISOString();

      switch (operation) {
        case 'createTransfer': {
          const type = this.getNodeParameter('type', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const asset = this.getNodeParameter('asset', i) as string;

          const requestPath = '/v3/transfers';
          const body = JSON.stringify({
            type,
            amount,
            asset,
          });

          const signature = createSignature(timestamp, 'POST', requestPath, body);

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}${requestPath}`,
            headers: {
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-SIGNATURE': signature,
              'DYDX-TIMESTAMP': timestamp,
              'DYDX-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllTransfers': {
          const typeFilter = this.getNodeParameter('type', i, '') as string;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const createdBeforeOrAt = this.getNodeParameter('createdBeforeOrAt', i, '') as string;

          const queryParams = new URLSearchParams();
          if (typeFilter) queryParams.append('type', typeFilter);
          if (limit) queryParams.append('limit', limit.toString());
          if (createdBeforeOrAt) queryParams.append('createdBeforeOrAt', createdBeforeOrAt);

          const requestPath = `/v3/transfers${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
          const signature = createSignature(timestamp, 'GET', requestPath);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}${requestPath}`,
            headers: {
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-SIGNATURE': signature,
              'DYDX-TIMESTAMP': timestamp,
              'DYDX-PASSPHRASE': credentials.passphrase,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransfer': {
          const transferId = this.getNodeParameter('transferId', i) as string;

          const requestPath = `/v3/transfers/${transferId}`;
          const signature = createSignature(timestamp, 'GET', requestPath);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}${requestPath}`,
            headers: {
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-SIGNATURE': signature,
              'DYDX-TIMESTAMP': timestamp,
              'DYDX-PASSPHRASE': credentials.passphrase,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

function createDydxSignature(secret: string, timestamp: string, method: string, requestPath: string, body: string = ''): string {
  const crypto = require('crypto');
  const message = timestamp + method + requestPath + body;
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

async function executeMarketsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dydxdexApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const timestamp = new Date().toISOString();
      
      switch (operation) {
        case 'getAllMarkets': {
          const requestPath = '/v3/markets';
          const signature = createDydxSignature(
            credentials.apiSecret,
            timestamp,
            'GET',
            requestPath
          );

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.dydx.exchange'}${requestPath}`,
            headers: {
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-SIGNATURE': signature,
              'DYDX-TIMESTAMP': timestamp,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getMarket': {
          const market = this.getNodeParameter('market', i) as string;
          const requestPath = `/v3/markets/${market}`;
          const signature = createDydxSignature(
            credentials.apiSecret,
            timestamp,
            'GET',
            requestPath
          );

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.dydx.exchange'}${requestPath}`,
            headers: {
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-SIGNATURE': signature,
              'DYDX-TIMESTAMP': timestamp,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }
  
  return returnData;
}

function createSignature(secret: string, timestamp: string, method: string, requestPath: string, body: string = ''): string {
  const message = timestamp + method.toUpperCase() + requestPath + body;
  return crypto.createHmac('sha256', secret).update(message).digest('base64');
}

async function executeCandlesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dydxdexApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getCandles': {
          const market = this.getNodeParameter('market', i) as string;
          const resolution = this.getNodeParameter('resolution', i) as string;
          const fromISO = this.getNodeParameter('fromISO', i) as string;
          const toISO = this.getNodeParameter('toISO', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;

          // Build query parameters
          const queryParams: any = {
            resolution,
          };

          if (fromISO) {
            queryParams.fromISO = new Date(fromISO).toISOString();
          }

          if (toISO) {
            queryParams.toISO = new Date(toISO).toISOString();
          }

          if (limit) {
            queryParams.limit = limit.toString();
          }

          const queryString = new URLSearchParams(queryParams).toString();
          const requestPath = `/v3/candles/${market}${queryString ? '?' + queryString : ''}`;
          
          // Create signature for authentication
          const timestamp = Date.now().toString();
          const signature = createSignature(
            credentials.secret,
            timestamp,
            'GET',
            requestPath
          );

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}${requestPath}`,
            headers: {
              'DYDX-SIGNATURE': signature,
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-TIMESTAMP': timestamp,
              'DYDX-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
            { itemIndex: i }
          );
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error, { itemIndex: i });
      }
    }
  }

  return returnData;
}

async function executeTradesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dydxdexApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      switch (operation) {
        case 'getMarketTrades': {
          const market = this.getNodeParameter('market', i) as string;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const startingBeforeOrAt = this.getNodeParameter('startingBeforeOrAt', i, '') as string;

          const queryParams: any = {
            limit: limit.toString(),
          };

          if (startingBeforeOrAt) {
            queryParams.startingBeforeOrAt = startingBeforeOrAt;
          }

          const queryString = new URLSearchParams(queryParams).toString();
          const endpoint = `/v3/trades/${market}`;
          const url = `${credentials.baseUrl}${endpoint}?${queryString}`;

          // Create request signature for authentication
          const timestamp = new Date().toISOString();
          const method = 'GET';
          const requestPath = `${endpoint}?${queryString}`;
          const body = '';
          
          const message = timestamp + method + requestPath + body;
          const signature = crypto
            .createHmac('sha256', credentials.secret)
            .update(message)
            .digest('base64');

          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'DYDX-SIGNATURE': signature,
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-TIMESTAMP': timestamp,
              'DYDX-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ 
        json: result,
        pairedItem: { item: i }
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }
  
  return returnData;
}

function signRequest(method: string, path: string, body: string, timestamp: string, apiSecret: string): string {
  const message = timestamp + method + path + body;
  return crypto.createHmac('sha256', apiSecret).update(message).digest('hex');
}

async function executeOrderbookOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dydxdexApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getOrderbook': {
          const market = this.getNodeParameter('market', i) as string;
          
          if (!market) {
            throw new NodeOperationError(this.getNode(), 'Market parameter is required');
          }

          const timestamp = new Date().toISOString();
          const path = `/v3/orderbook/${market}`;
          const method = 'GET';
          const body = '';

          const signature = signRequest(method, path, body, timestamp, credentials.apiSecret);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.dydx.exchange'}/v3/orderbook/${market}`,
            headers: {
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-TIMESTAMP': timestamp,
              'DYDX-SIGNATURE': signature,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (!result.orderbook) {
            throw new NodeApiError(this.getNode(), {
              message: 'Invalid response format from dYdX API',
              description: 'Expected orderbook data in response',
            } as any);
          }

          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeHistoricalPnlOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dydxdexApi') as any;

  function signRequest(method: string, path: string, body: string, timestamp: string): string {
    const message = timestamp + method + path + body;
    return createHmac('sha256', credentials.privateKey)
      .update(message)
      .digest('hex');
  }

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const timestamp = new Date().toISOString();

      switch (operation) {
        case 'getAllHistoricalPnl': {
          const createdBeforeOrAt = this.getNodeParameter('createdBeforeOrAt', i) as string;
          const createdOnOrAfter = this.getNodeParameter('createdOnOrAfter', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;

          const queryParams: any = {};
          if (createdBeforeOrAt) queryParams.createdBeforeOrAt = createdBeforeOrAt;
          if (createdOnOrAfter) queryParams.createdOnOrAfter = createdOnOrAfter;
          if (limit) queryParams.limit = limit.toString();

          const queryString = Object.keys(queryParams).length > 0 
            ? '?' + new URLSearchParams(queryParams).toString() 
            : '';
          const path = `/v3/historical-pnl${queryString}`;

          const signature = signRequest('GET', path, '', timestamp);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}${path}`,
            headers: {
              'DYDX-SIGNATURE': signature,
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-TIMESTAMP': timestamp,
              'DYDX-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getHistoricalPnl': {
          const id = this.getNodeParameter('id', i) as string;
          const path = `/v3/historical-pnl/${id}`;

          const signature = signRequest('GET', path, '', timestamp);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}${path}`,
            headers: {
              'DYDX-SIGNATURE': signature,
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-TIMESTAMP': timestamp,
              'DYDX-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ 
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}

function createHmacSignature(secret: string, method: string, path: string, timestamp: string, body?: string): string {
  const message = timestamp + method + path + (body || '');
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

async function executeTradingRewardsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dydxdexApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const timestamp = new Date().toISOString();
      
      switch (operation) {
        case 'getTradingRewards': {
          const epoch = this.getNodeParameter('epoch', i) as number;
          let path = '/v3/rewards/weight';
          
          if (epoch) {
            path += `?epoch=${epoch}`;
          }

          const signature = createHmacSignature(
            credentials.apiSecret,
            'GET',
            path,
            timestamp
          );

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + path,
            headers: {
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-SIGNATURE': signature,
              'DYDX-TIMESTAMP': timestamp,
              'DYDX-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTradingRewardsByAddress': {
          const address = this.getNodeParameter('address', i) as string;
          const epoch = this.getNodeParameter('epoch', i) as number;
          let path = `/v3/rewards/weight/${address}`;
          
          if (epoch) {
            path += `?epoch=${epoch}`;
          }

          const signature = createHmacSignature(
            credentials.apiSecret,
            'GET',
            path,
            timestamp
          );

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + path,
            headers: {
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-SIGNATURE': signature,
              'DYDX-TIMESTAMP': timestamp,
              'DYDX-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }
  
  return returnData;
}

function createSignature(secret: string, message: string): string {
  return createHmac('sha256', secret).update(message).digest('hex');
}

function createTimestamp(): string {
  return new Date().toISOString();
}

async function executeLiquidityProviderRewardsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dydxdexApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const timestamp = createTimestamp();

      switch (operation) {
        case 'getLiquidityProviderRewards': {
          const epoch = this.getNodeParameter('epoch', i) as number;
          
          let url = `${credentials.baseUrl}/liquidity-provider-rewards`;
          const queryParams: string[] = [];
          
          if (epoch && epoch > 0) {
            queryParams.push(`epoch=${epoch}`);
          }
          
          if (queryParams.length > 0) {
            url += '?' + queryParams.join('&');
          }

          const message = `GET${url.replace(credentials.baseUrl, '')}${timestamp}`;
          const signature = createSignature(credentials.secret, message);

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-TIMESTAMP': timestamp,
              'DYDX-SIGNATURE': signature,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getLiquidityProviderRewardsByAddress': {
          const address = this.getNodeParameter('address', i) as string;
          const epoch = this.getNodeParameter('epoch', i) as number;

          if (!address) {
            throw new NodeOperationError(this.getNode(), 'Address is required');
          }

          let url = `${credentials.baseUrl}/liquidity-provider-rewards/${address}`;
          const queryParams: string[] = [];
          
          if (epoch && epoch > 0) {
            queryParams.push(`epoch=${epoch}`);
          }
          
          if (queryParams.length > 0) {
            url += '?' + queryParams.join('&');
          }

          const message = `GET${url.replace(credentials.baseUrl, '')}${timestamp}`;
          const signature = createSignature(credentials.secret, message);

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'DYDX-API-KEY': credentials.apiKey,
              'DYDX-TIMESTAMP': timestamp,
              'DYDX-SIGNATURE': signature,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}
