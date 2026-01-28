import type { INodeProperties } from 'n8n-workflow';

export const accessPolicyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
        resource: ['accessPolicy'],
      },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get an access policy',
				description: 'Get an access policy',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get access policies',
				description: 'Get access policies',
			},
		],
		default: 'getAll',
	},
];

export const accessPolicyFields: INodeProperties[] = [
	{
		displayName: 'Access Policy ID',
		name: 'accessPolicyId',
		type: 'string',
		default: '',
    required: true,
		displayOptions: { 
      show: {
        resource: ['accessPolicy'],
        operation: ['get'],
      },
    },
		description: "The access policy's ID",
	},
];
