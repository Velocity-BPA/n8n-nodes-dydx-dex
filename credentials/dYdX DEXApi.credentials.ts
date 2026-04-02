import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class dYdXDEXApi implements ICredentialType {
	name = 'dydxDexApi';
	displayName = 'dYdX DEX API';
	documentationUrl = 'https://docs.dydx.exchange/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.dydx.exchange',
			description: 'Base URL for dYdX API',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API Key from dYdX account',
		},
		{
			displayName: 'Secret',
			name: 'secret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Secret from dYdX account',
		},
		{
			displayName: 'Passphrase',
			name: 'passphrase',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Passphrase from dYdX account',
		},
		{
			displayName: 'STARK Private Key',
			name: 'starkPrivateKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'STARK private key for signing private endpoint requests',
		},
		{
			displayName: 'Ethereum Address',
			name: 'ethereumAddress',
			type: 'string',
			default: '',
			description: 'Ethereum address associated with dYdX account',
		},
	];
}