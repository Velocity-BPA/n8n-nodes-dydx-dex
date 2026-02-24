import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class dYdXDEXApi implements ICredentialType {
	name = 'dYdXDEXApi';
	displayName = 'dYdX DEX API';
	documentationUrl = 'https://docs.dydx.exchange/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'apiBaseUrl',
			type: 'string',
			default: 'https://api.dydx.exchange/v3',
			required: true,
			description: 'The base URL for the dYdX API',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API key for authentication (DYDX-API-KEY header)',
		},
		{
			displayName: 'API Secret',
			name: 'apiSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API secret for signing requests',
		},
		{
			displayName: 'API Passphrase',
			name: 'apiPassphrase',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API passphrase (DYDX-PASSPHRASE header)',
		},
	];
}