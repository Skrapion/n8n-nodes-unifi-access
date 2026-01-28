import type { INodeProperties } from 'n8n-workflow';

export const deviceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
        resource: ['device'],
      },
		},
		options: [
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get devices',
        description: 'Get devices',
      },
    ],
		default: 'getAll',
	},
];

export const deviceFields: INodeProperties[] = [
]
