import type { INodeProperties } from 'n8n-workflow';

export const credentialOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
        resource: ['credential'],
      },
		},
		options: [
      {
        name: 'Generate PIN',
        value: 'generatePin',
        action: 'Generate a random PIN',
        description: 'Generate a random PIN',
      },
			{
				name: 'Get NFC Card',
				value: 'getNfc',
        // eslint-disable-next-line n8n-nodes-base/node-param-operation-option-action-miscased
				action: 'Get an NFC Card',
				description: 'Get an NFC Card',
			},
			{
				name: 'Get Many NFC Cards',
				value: 'getAllNfcs',
        // eslint-disable-next-line n8n-nodes-base/node-param-operation-option-action-miscased
				action: 'Get NFC Cards',
				description: 'Get NFC Cards',
			},
    ],
		default: 'generatePin',
	},
];

export const credentialFields: INodeProperties[] = [
	{
		displayName: 'NFC Token',
		name: 'nfcToken',
		type: 'string',
		default: '',
    required: true,
		displayOptions: { 
      show: {
        resource: ['credential'],
        operation: ['getNfc'],
      },
    },
    typeOptions: {
      password: true,
    },
		description: "The NFC card's token",
	},
  {
    displayName: 'Options',
    name: 'optionsGetAllNfcs',
    type: 'collection',
    placeholder: 'Add option',
    default: {},
    options: [
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        description: 'Max number of results to return',
        typeOptions: {
          minValue: 1,
          step: 1,
        }
      }
    ],
    displayOptions: { 
      show: {
        resource: ['credential'],
        operation: ['getAllNfcs'],
      },
    },
  },
]
