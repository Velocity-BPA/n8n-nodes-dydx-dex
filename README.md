# n8n-nodes-dydx-dex

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with dYdX DEX, the leading decentralized derivatives exchange. Access 11+ resources including trading operations, market data, and portfolio management with comprehensive support for perpetual futures trading, order management, and real-time position tracking.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![dYdX DEX](https://img.shields.io/badge/dYdX-DEX-purple)
![DeFi](https://img.shields.io/badge/DeFi-Trading-green)
![Perpetuals](https://img.shields.io/badge/Perpetual-Futures-orange)

## Features

- **Complete Trading Operations** - Execute orders, manage positions, and monitor fills across all dYdX perpetual markets
- **Real-time Market Data** - Access live orderbook, trades, candles, and comprehensive market information
- **Portfolio Management** - Track account balances, positions, transfers, and historical P&L performance
- **Rewards Integration** - Monitor trading rewards and liquidity provider incentives
- **Advanced Analytics** - Historical data analysis with candles, fills, and performance metrics
- **Secure Authentication** - API key-based authentication with comprehensive error handling
- **WebSocket Support** - Real-time data streaming for live market monitoring
- **Risk Management** - Position tracking and P&L monitoring for effective risk control

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-dydx-dex`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-dydx-dex
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-dydx-dex.git
cd n8n-nodes-dydx-dex
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-dydx-dex
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your dYdX API key from account settings | Yes |
| API Secret | Your dYdX API secret for request signing | Yes |
| API Passphrase | Your dYdX API passphrase | Yes |
| Stark Private Key | Your Stark private key for Layer 2 operations | Yes |
| Environment | Trading environment (mainnet/testnet) | Yes |
| Account Number | Your dYdX account number | No |

## Resources & Operations

### 1. Accounts

| Operation | Description |
|-----------|-------------|
| Get Account | Retrieve account information and balances |
| List Accounts | Get all accounts for the authenticated user |
| Update Account | Modify account settings and preferences |

### 2. Orders

| Operation | Description |
|-----------|-------------|
| Create Order | Place a new order on dYdX |
| Get Order | Retrieve details of a specific order |
| List Orders | Get all orders with optional filtering |
| Cancel Order | Cancel an existing order |
| Cancel All Orders | Cancel all open orders for a market |
| Update Order | Modify an existing order |

### 3. Positions

| Operation | Description |
|-----------|-------------|
| Get Position | Retrieve details of a specific position |
| List Positions | Get all current positions |
| Close Position | Close an existing position |
| Update Position | Modify position parameters |

### 4. Fills

| Operation | Description |
|-----------|-------------|
| Get Fill | Retrieve details of a specific fill |
| List Fills | Get all fills with filtering options |
| Export Fills | Export fill data for accounting |

### 5. Transfers

| Operation | Description |
|-----------|-------------|
| Get Transfer | Retrieve details of a specific transfer |
| List Transfers | Get all transfers with filtering |
| Create Deposit | Initiate a deposit to dYdX |
| Create Withdrawal | Request a withdrawal from dYdX |
| Get Deposit Address | Retrieve deposit address for assets |

### 6. Markets

| Operation | Description |
|-----------|-------------|
| Get Market | Retrieve details of a specific market |
| List Markets | Get all available markets |
| Get Market Stats | Retrieve 24h statistics for markets |
| Get Market Status | Check market operational status |

### 7. Candles

| Operation | Description |
|-----------|-------------|
| Get Candles | Retrieve OHLCV candle data |
| List Historical Candles | Get historical candle data with time ranges |
| Get Latest Candle | Retrieve the most recent candle |

### 8. Trades

| Operation | Description |
|-----------|-------------|
| Get Trade | Retrieve details of a specific trade |
| List Trades | Get recent trades for a market |
| Get Trade History | Retrieve historical trade data |

### 9. Orderbook

| Operation | Description |
|-----------|-------------|
| Get Orderbook | Retrieve current orderbook snapshot |
| Get Level 2 Data | Get aggregated orderbook levels |
| Get Best Bid Ask | Retrieve top of book prices |

### 10. HistoricalPnl

| Operation | Description |
|-----------|-------------|
| Get Historical PnL | Retrieve historical profit and loss data |
| List PnL Records | Get PnL records with date filtering |
| Get Daily PnL | Retrieve daily PnL summaries |
| Export PnL Data | Export PnL data for analysis |

### 11. TradingRewards

| Operation | Description |
|-----------|-------------|
| Get Trading Rewards | Retrieve current trading rewards |
| List Reward History | Get historical trading rewards |
| Get Reward Summary | Retrieve reward summaries by period |

### 12. LiquidityProviderRewards

| Operation | Description |
|-----------|-------------|
| Get LP Rewards | Retrieve liquidity provider rewards |
| List LP History | Get historical LP reward data |
| Get LP Stats | Retrieve LP performance statistics |

## Usage Examples

```javascript
// Create a new order
{
  "market": "BTC-USD",
  "side": "BUY", 
  "type": "LIMIT",
  "size": "0.01",
  "price": "45000",
  "timeInForce": "GTT",
  "postOnly": true,
  "reduceOnly": false
}
```

```javascript
// Get account positions
{
  "market": "ETH-USD",
  "status": "OPEN",
  "limit": 100,
  "createdBeforeOrAt": "2024-01-01T00:00:00.000Z"
}
```

```javascript
// Retrieve market candles
{
  "market": "BTC-USD",
  "resolution": "1HOUR",
  "fromISO": "2024-01-01T00:00:00.000Z",
  "toISO": "2024-01-02T00:00:00.000Z",
  "limit": 100
}
```

```javascript
// Get trading rewards
{
  "epoch": 150,
  "epochCredits": true,
  "aggregatePeriods": ["DAILY", "WEEKLY"],
  "limit": 50
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key, secret, and passphrase in credentials |
| Insufficient Balance | Account lacks sufficient balance for operation | Check account balance and reduce order size |
| Market Closed | Attempting to trade on inactive market | Verify market status and trading hours |
| Position Not Found | Requested position does not exist | Confirm position exists and market symbol is correct |
| Rate Limit Exceeded | Too many API requests in time window | Implement request throttling and retry logic |
| Invalid Order Parameters | Order parameters violate market rules | Check minimum order size, price increments, and market rules |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-dydx-dex/issues)
- **dYdX API Documentation**: [dYdX API Docs](https://docs.dydx.exchange/)
- **dYdX Community**: [dYdX Discord](https://discord.gg/dydx)