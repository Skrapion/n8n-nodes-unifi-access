import type { INodeProperties } from 'n8n-workflow';

export const identityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
        resource: ['identity'],
      },
		},
		options: [
			{
				name: 'Send Identity Invitations',
				value: 'sendInvitations',
        // eslint-disable-next-line n8n-nodes-base/node-param-operation-option-action-miscased
				action: 'Send UniFi Identity invitations',
				description: 'Send UniFi Identity invitations',
			},
		],
		default: 'sendInvitations',
	},
];

export const identityFields: INodeProperties[] = [
	{
		displayName: 'Invitations',
		name: 'invitations',
		type: 'fixedCollection',
    placeholder: 'Add Invitation',
		default: [],
		displayOptions: { 
      show: {
        resource: ['identity'],
        operation: ['sendInvitations'],
      },
    },
    typeOptions: {
      multipleValues: true,
    },
    options: [
      {
        displayName: 'Invitation',
        name: 'invitation',
        values: [
          {
            displayName: 'User ID',
            name: 'userId',
            type: 'string',
            default: '',
            required: true,
          },
          {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            default: '',
            placeholder: 'name@email.com',
            description: "If an email it set, it will also update the user's email"
          },
        ],
      },
    ],
    description: 'The invitations to send',
	},
];
