import type { INodeProperties } from 'n8n-workflow';
import { eventOptions } from './EventOptions';

export const notificationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
        resource: ['notification'],
      },
		},
		options: [
			{
				name: 'Add Webhook',
				value: 'add',
				action: 'Add a webhook endpoint',
				description: 'Add a webhook endpoint',
			},
			{
				name: 'Delete Webhook',
				value: 'delete',
				action: 'Delete a webhook endpoint',
				description: 'Delete a webhook endpoint',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get webhook endpoints',
				description: 'Get webhook endpoints',
			},
			{
				name: 'Update Webhook',
				value: 'update',
				action: 'Update a webhook endpoint',
				description: 'Update a webhook endpoint',
			},
		],
		default: 'getAll',
	},
];

export const notificationFields: INodeProperties[] = [
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		default: '',
    required: true,
		displayOptions: { 
      show: {
        resource: ['notification'],
        operation: ['delete', 'update'],
      },
    },
		description: "The ID of the webhook",
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
    required: true,
		displayOptions: { 
      show: {
        resource: ['notification'],
        operation: ['add', 'update'],
      },
    },
		description: "The name of the webhook subscription",
	},
	{
		displayName: 'Endpoint',
		name: 'endpoint',
		type: 'string',
		default: '',
    required: true,
		displayOptions: { 
      show: {
        resource: ['notification'],
        operation: ['add', 'update'],
      },
    },
		description: "The URL where the events are sent",
	},
  {
    displayName: 'Events',
    name: 'events',
    type: 'multiOptions',
    options: [...eventOptions],
    required: true,
    default: [],
		displayOptions: { 
      show: {
        resource: ['notification'],
        operation: ['add', 'update'],
      },
    },
    description: 'The events to listen to',
  },
];
