# n8n-nodes-dydx-dex

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with dYdX DEX, the leading decentralized exchange for perpetual trading. This node provides 7 resources with comprehensive trading, account management, and market data capabilities for automated DeFi trading workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![DeFi](https://img.shields.io/badge/DeFi-Trading-green)
![dYdX](https://img.shields.io/badge/dYdX-DEX-purple)
![Perpetuals](https://img.shields.io/badge/Perpetuals-Futures-orange)

## Features

- **Market Data Access** - Retrieve real-time market data, orderbook depth, and trading statistics
- **Order Management** - Create, modify, cancel, and track perpetual futures orders
- **Position Tracking** - Monitor open positions, PnL, and margin requirements
- **Account Operations** - Manage account balances, equity, and trading permissions  
- **Transfer Functions** - Handle deposits, withdrawals, and cross-margin transfers
- **Funding Operations** - Track funding rates and payment history for perpetual contracts
- **API Key Management** - Secure credential handling with proper authentication
- **Rate Limiting** - Built-in request throttling to respect dYdX API limits

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
| API Key | Your dYdX API key from the dashboard | Yes |
| API Secret | Your dYdX API secret for signing requests | Yes |
| Passphrase | Your dYdX API passphrase | Yes |
| Stark Private Key | Your Stark private key for Layer 2 operations | Yes |
| Environment | API environment (mainnet/testnet) | Yes |

## Resources & Operations

### 1. Market

| Operation | Description |
|-----------|-------------|
| Get Markets | Retrieve all available trading markets |
| Get Market | Get details for a specific market |
| Get Orderbook | Fetch current orderbook for a market |
| Get Trades | Get recent trades for a market |
| Get Candles | Retrieve OHLCV candle data |
| Get Stats | Get 24h trading statistics |

### 2. Order

| Operation | Description |
|-----------|-------------|
| Create Order | Place a new perpetual futures order |
| Cancel Order | Cancel an existing order |
| Cancel All Orders | Cancel all open orders |
| Get Order | Retrieve details of a specific order |
| Get Orders | List all orders with filters |
| Get Order History | Fetch historical order data |

### 3. Position

| Operation | Description |
|-----------|-------------|
| Get Positions | List all open positions |
| Get Position | Get details for a specific position |
| Close Position | Close an open position |
| Adjust Margin | Add or remove margin from position |
| Get Position History | Retrieve historical position data |

### 4. Account

| Operation | Description |
|-----------|-------------|
| Get Account | Fetch account information and balances |
| Update Account | Modify account settings |
| Get Equity | Retrieve current account equity |
| Get Balances | Get all asset balances |
| Get Trading Rewards | Fetch trading reward history |

### 5. Transfer

| Operation | Description |
|-----------|-------------|
| Create Transfer | Initiate a deposit or withdrawal |
| Get Transfers | List transfer history |
| Get Transfer | Get details of a specific transfer |
| Fast Withdraw | Execute fast withdrawal to Layer 1 |

### 6. Funding

| Operation | Description |
|-----------|-------------|
| Get Funding Rates | Retrieve current funding rates |
| Get Funding History | Fetch historical funding payments |
| Get Funding Payments | Get funding payments for positions |

### 7. ApiKey

| Operation | Description |
|-----------|-------------|
| Get API Keys | List all API keys for account |
| Create API Key | Generate new API key |
| Delete API Key | Remove an existing API key |

## Usage Examples

```javascript
// Get market data for BTC-USD perpetual
{
  "market": "BTC-USD",
  "operation": "getMarket"
}
```

```javascript
// Place a long order for 0.1 BTC
{
  "market": "BTC-USD", 
  "side": "BUY",
  "type": "LIMIT",
  "size": "0.1",
  "price": "45000",
  "timeInForce": "GTC",
  "postOnly": false,
  "reduceOnly": false
}
```

```javascript
// Check current positions
{
  "operation": "getPositions",
  "market": "BTC-USD",
  "status": "OPEN"
}
```

```javascript
// Get account balances
{
  "operation": "getBalances"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key, secret, and passphrase are correct |
| Insufficient Balance | Not enough collateral for the requested operation | Check account balance and reduce order size |
| Market Closed | Attempting to trade when market is offline | Wait for market to reopen or check market status |
| Rate Limit Exceeded | Too many requests sent to API | Implement delays between requests and respect rate limits |
| Invalid Order Size | Order size doesn't meet minimum requirements | Check market minimums and adjust order size |
| Position Not Found | Requested position doesn't exist | Verify position exists and market symbol is correct |

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
- **dYdX API Documentation**: [docs.dydx.exchange](https://docs.dydx.exchange/)
- **dYdX Community**: [dYdX Discord](https://discord.com/invite/Tuze6tY)