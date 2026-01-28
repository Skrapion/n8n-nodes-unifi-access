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
    ],
		default: 'generatePin',
	},
];

export const credentialFields: INodeProperties[] = [
]
