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
        name: 'Enroll NFC Card',
        value: 'enrollNfc',
        action: 'Enroll an NFC card',
        description: 'Wake up a UA reader and create a session to enroll an NFC card',
      },
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
    displayName: 'Device Name or ID',
    name: 'deviceId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getDevices',
    },
    default: '',
    required: true,
		displayOptions: { 
      show: {
        resource: ['credential'],
        operation: ['enrollNfc'],
      },
    },
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },
  {
    displayName: 'Reset NFC Card',
    name: 'resetNfc',
    type: 'boolean',
    default: false,
		displayOptions: { 
      show: {
        resource: ['credential'],
        operation: ['enrollNfc'],
      },
    },
    description: "Whether we should reset this NFC card it it's already registered to another site",
  },
  {
    displayName: 'Options',
    name: 'optionsEnrollNfc',
    type: 'collection',
    placeholder: 'Add option',
    default: {},
    options: [
      {
        displayName: 'Max Wait Time',
        name: 'maxWaitTime',
        type: 'number',
        default: 15,
        description: 'Maximum number of seconds to wait for the NFC card to enroll',
        typeOptions: {
          minValue: 1,
          maxValue: 300,
          step: 1,
        }
      }
    ],
		displayOptions: { 
      show: {
        resource: ['credential'],
        operation: ['enrollNfc'],
      },
    },
  },
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
