import type {
	IAuthenticateGeneric,
  Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class UnifiAccessApi implements ICredentialType {
	name = 'unifiAccessApi';

	displayName = 'Unifi Access API';

	// Link to your community node's README
	documentationUrl = 'https://github.com/org/-unifi-access?tab=readme-ov-file#credentials';

  icon: Icon = {
    light: 'file:../nodes/UnifiAccess/unifiAccess.svg',
    dark: 'file:../nodes/UnifiAccess/unifiAccess.dark.svg',
  };

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
    {
      displayName: 'Unifi Access URL',
      name: 'url',
      type: 'string',
      default: '',
      required: true,
      placeholder: 'https://example.com:12445',
    },
    // eslint-disable-next-line @n8n/community-nodes/credential-password-field
    {
      displayName: 'Ignore SSL Issues (Insecure)',
      name: 'allowUnauthorizedCerts',
      type: 'boolean',
      description: 'Whether to connect even if SSL certificate validtion is not possible',
      default: false,
    }
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.url}}/api/v1',
			url: '/developer/users',
      method: 'GET',
      skipSslCertificateValidation: '={{$credentials.allowUnauthorizedCerts}}',
		},
	};
}
