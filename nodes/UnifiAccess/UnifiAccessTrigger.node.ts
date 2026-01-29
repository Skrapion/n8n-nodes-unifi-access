import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { unifiAccessApiRequest } from './GenericFunctions';

export class UnifiAccessTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'UniFi Access Trigger',
		name: 'unifiAccessTrigger',
		icon: { light: 'file:unifiAccess.svg', dark: 'file:unifiAccess.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle:
			'={{$parameter["owner"] + "/" + $parameter["repository"] + ": " + $parameter["events"].join(", ")}}',
		description: 'Starts the workflow when UniFi Access events occur',
		defaults: {
			name: 'UniFi Access Trigger',
		},
		usableAsTool: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'unifiAccessApi', required: true }],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
          {
            name: 'Door Position Change',
            value: 'access.device.dps_status',
            description: 'Indicates a change in the door position sensor (DPS) status',
          },
          {
            name: 'Door Unlock',
            value: 'access.door.unlock',
            description: 'Triggered on all door unlock events',
          },
					{
						name: 'Doorbell Call Incoming',
						value: 'access.doorbell.incoming',
            description: 'Triggered when a doorbell rings (incoming call)',
          },
          {
            name: 'Doorbell Event Completed',
            value: 'access.doorbell.completed',
            description: 'Triggered when a doorbell event is accepted, declined, or canceled',
          },
          {
            name: 'Doorbell Request-to-Enter',
            value: 'access.doorbell.incoming.REN',
            description: 'Triggered by doorbells activated via Request-to-Enter (REN) buttons',
          },
          {
            name: 'Emergency Status Change',
            value: 'access.device.emergency_status',
            description: 'Indicates a change in emergency mode status',
          },
          {
            name: 'Temporary Unlock End',
            value: 'access.temporary_unlock.end',
            description: 'Triggered when a temporary unlock ends',
          },
          {
            name: 'Temporary Unlock Start',
            value: 'access.temporary_unlock.start',
            description: 'Triggered when a temporary unlock starts',
          },
          {
            name: 'Unlock Schedule Active',
            value: 'access.unlock_schedule.activate',
            description: 'Triggered when an unlock schedule becomes active',
          },
          {
            name: 'Unlock Schedule Inactive',
            value: 'access.unlock_schedule.deactivate',
            description: 'Triggered when an unlock schedule becomes inactive',
          },
          {
            name: 'Visitor Status Change',
            value: 'access.visitor.status.changed',
						description: 'Indicates that a visitor’s status has changed',
					},
				],
				required: true,
				default: [],
				description: 'The events to listen to',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId === undefined) {
					// No webhook id is set so no webhook can exist
					return false;
				}

				const responseData = await unifiAccessApiRequest.call(this, 'GET', 'webhooks/endpoints', {});

        for (const response of responseData) {
          if (response.id === webhookData.webhookId) {
            return true;
          }
        }

        // If it wasn't found in the response list, then it doesn't exist
        return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				if (webhookUrl.includes('//localhost')) {
					throw new NodeOperationError(
						this.getNode(),
						'The Webhook can not work on "localhost". Please setup n8n on a custom domain.',
					);
				}

				const events = this.getNodeParameter('events', []);

				const body = {
					name: 'web',
          endpoint: webhookUrl,
          events: events,
        };

				const webhookData = this.getWorkflowStaticData('node');

				const responseData = await unifiAccessApiRequest.call(this, 'POST', 'webhooks/endpoints', body);

				webhookData.webhookId = responseData[0].id as string;
				webhookData.webhookEvents = responseData[0].events as string[];
				webhookData.webhookSecret = responseData[0].secret as string;

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					await unifiAccessApiRequest.call(this, 'DELETE', `webhooks/endpoints/${webhookData.webhookId}`, {});

					// Remove from the static workflow data so that it is clear
					// that no webhooks are registered anymore
					delete webhookData.webhookId;
					delete webhookData.webhookEvents;
					delete webhookData.webhookSecret;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		const returnData: IDataObject[] = [];

		returnData.push(bodyData);

		return {
			workflowData: [this.helpers.returnJsonArray(returnData)],
		};
	}
}
