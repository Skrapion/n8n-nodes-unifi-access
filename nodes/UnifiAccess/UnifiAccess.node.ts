import type {
  IDataObject,
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription, 
  JsonObject,
} from 'n8n-workflow';
import { sleep, NodeOperationError, NodeConnectionTypes } from 'n8n-workflow';

import { unifiAccessApiRequest } from './GenericFunctions';
import { userOperations, userFields } from './UserDescription';
import { accessPolicyOperations, accessPolicyFields } from './AccessPolicyDescription';
import { credentialOperations, credentialFields } from './CredentialDescription';
import { deviceOperations, deviceFields } from './DeviceDescription';

/*function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}*/

export class UnifiAccess implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'UniFi Access',
		name: 'unifiAccess',
		icon: { light: 'file:unifiAccess.svg', dark: 'file:unifiAccess.dark.svg' },
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the UniFi Access API',
		defaults: {
			name: 'UniFi Access',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'unifiAccessApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'User',
						value: 'user',
					},
          {
            name: 'Access Policy',
            value: 'accessPolicy',
          },
          {
            name: 'Credential',
            value: 'credential',
          },
          {
            name: 'Device',
            value: 'device',
          },
				],
				default: 'user',
			},
			...userOperations,
      ...userFields,
      ...accessPolicyOperations,
      ...accessPolicyFields,
      ...credentialOperations,
      ...credentialFields,
			...deviceOperations,
      ...deviceFields,
		]
  };

  methods = {
    loadOptions: {
      async getAccessPolicies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];
        const accessPolicies = await unifiAccessApiRequest.call(this, 'GET', 'access_policies', {});
        for (const accessPolicy of accessPolicies) {
          const accessPolicyName = accessPolicy.name as string;
          const accessPolicyId = accessPolicy.id as string;

          returnData.push({
            name: accessPolicyName,
            value: accessPolicyId,
          });
        }
        return returnData;
      },

      async getDevices(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];
        const grouped = await unifiAccessApiRequest.call(this, 'GET', 'devices', {});

        const flat = grouped.flat();
        const byId = new Map<string, IDataObject>();
        for (const d of flat) {
          const id = d.id as string;
          if (id) byId.set(id, d);
        }
        const devices = [...byId.values()];

        for (const device of devices) {
          const deviceName = (device.alias || device.name) as string;
          const deviceId = device.id as string;

          returnData.push({
            name: deviceName,
            value: deviceId,
          });
        }
        return returnData;
      }
    }
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let responseData;
		const qs: IDataObject = {};
	  const body: IDataObject = {};
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < length; i++) {
			try {
        // These are ordered in the same order as in the API reference, with chapter numbers.
        // See https://assets.identity.ui.com/unifi-access/api_reference.pdf
        
        // 3. User
				if (resource === 'user') {
          // 3.2 User Registration
          if (operation === 'create') {
            const firstName = this.getNodeParameter('firstName', i) as string;
            const lastName = this.getNodeParameter('lastName', i) as string;
            const email = this.getNodeParameter('email', i) as string;
            const employeeNumber = this.getNodeParameter('employeeNumber', i) as string;
            const onboardTime = this.getNodeParameter('onboardTime', i) as string;

            body['first_name'] = firstName;
            body['last_name'] = lastName;
            if (email) {
              body['user_email'] = email;
            }
            if (employeeNumber) {
              body['employee_number'] = employeeNumber;
            }
            if (onboardTime) {
              body['onboard_time'] = Math.floor(new Date(onboardTime).getTime() / 1000);
            }
            responseData = await unifiAccessApiRequest.call(this, 'POST', 'users', body, {});
          }
          
          // 3.3 Update User
          if (operation === 'update') {
            const userId = this.getNodeParameter('userId', i) as string;
            const firstName = this.getNodeParameter('firstNameOpt', i) as string;
            const lastName = this.getNodeParameter('lastNameOpt', i) as string;
            const email = this.getNodeParameter('email', i) as string;
            const employeeNumber = this.getNodeParameter('employeeNumber', i) as string;
            const onboardTime = this.getNodeParameter('onboardTime', i) as string;
            const status = this.getNodeParameter('status', i) as string;

            if (firstName) {
              body['first_name'] = firstName;
            }
            if (lastName) {
              body['last_name'] = lastName;
            }
            if (email) {
              body['user_email'] = email;
            }
            if (employeeNumber) {
              body['employee_number'] = employeeNumber;
            }
            if (onboardTime) {
              body['onboard_time'] = Math.floor(new Date(onboardTime).getTime() / 1000);
            }
            if (status) {
              body['status'] = status;
            }
            responseData = await unifiAccessApiRequest.call(this, 'PUT', `users/${userId}`, body, {});
          }

          // 3.4 Fetch User
          if (operation === 'get') {
            const userId = this.getNodeParameter('userId', i) as string;
            const {
              expandAccessPolicies,
            } = this.getNodeParameter('optionsGet', i, {}) as {
              expandAccessPolicies: boolean;
            };

            if (expandAccessPolicies) {
              qs["expand[]"] = "access_policy"
            }
            responseData = await unifiAccessApiRequest.call(this, 'GET', `users/${userId}`, {}, qs);
          }

          // 3.5 Fetch All Users
					if (operation === 'getAll') {
            const {
              expandAccessPolicies,
              limit,
            } = this.getNodeParameter('optionsGetAll', i, {}) as {
              expandAccessPolicies: boolean;
              limit: number;
            };
            if (expandAccessPolicies) {
              qs["expand[]"] = "access_policy"
            }
            if (limit) {
              qs["page_num"] = 1;
              qs["page_size"] = limit;
            }
						responseData = await unifiAccessApiRequest.call(this, 'GET', 'users', {}, qs);
					}

          // 3.6 Assign Access Policy to User
          if (operation === 'assignAccessPolicy') {
            const userId = this.getNodeParameter('userId', i) as string;
            const accessPolicyIds = this.getNodeParameter('accessPolicyIds', i, {}) as string[];
            const overwrite = this.getNodeParameter('overwrite', i) as boolean;

            if (overwrite) {
              body['access_policy_ids'] = accessPolicyIds;
            } else {
		          const qs: IDataObject = {};
              qs['expand[]'] = 'access_policy';
              responseData = await unifiAccessApiRequest.call(this, 'GET', `users/${userId}`, {}, qs);
              if (responseData.length == 1) {
                body['access_policy_ids'] = [...new Set(accessPolicyIds.concat(responseData[0].access_policy_ids as string[]))];
              }
            }

						responseData = await unifiAccessApiRequest.call(this, 'PUT', `users/${userId}/access_policies`, body, qs);
          }

          // 3.9 Assign a PIN to a User
          if (operation === 'setPin') {
            const userId = this.getNodeParameter('userId', i) as string;
            const pin = this.getNodeParameter('pin', i) as string;
            if (!/^\d+$/.test(pin)) {
	            throw new NodeOperationError(this.getNode(), 'PIN must contain digits only (0–9).', { itemIndex: i });
            }
            body["pin_code"] = pin.toString();
						responseData = await unifiAccessApiRequest.call(this, 'PUT', `users/${userId}/pin_codes`, body, {});
          }

          // 3.10 Unassign a PIN from a User
          if (operation === 'clearPin') {
            const userId = this.getNodeParameter('userId', i) as string;
						responseData = await unifiAccessApiRequest.call(this, 'DELETE', `users/${userId}/pin_codes`, {}, {});
          }

          // 3.23 Delete User
          if (operation === 'delete') {
            const userId = this.getNodeParameter('userId', i) as string;
						responseData = await unifiAccessApiRequest.call(this, 'DELETE', `users/${userId}`, {}, {});
          }
          
          // 10. UniFi Identity
          //     This is included in this setion because it's in the /users/ space.
          // 10.1 Send UniFi Identity Invitations
          if (operation === 'sendInvitations') {
            type InvitationParam = {
              invitation: Array<{
                userId: string;
                email?: string;
              }>;
            };

            const raw = this.getNodeParameter('invitations', i, {}) as InvitationParam;

            const body: IDataObject[] = (raw.invitation ?? []).map((inv) => {
              const item: IDataObject = {
                user_id: inv.userId,
              };

              if (inv.email) {
                item.email = inv.email;
              }

              return item;
            });

						responseData = await unifiAccessApiRequest.call(this, 'POST', 'users/identity/invitations', body, {});
          }
        }

        // 6. Credentials
        if (resource === 'credential') {
          // 6.1 Generate PIN Code
          if (operation === 'generatePin') {
						responseData = await unifiAccessApiRequest.call(this, 'POST', 'credentials/pin_codes', {}, {}, {'resultName': 'pin'});
          }

          // 6.2-6.5 Enroll NFC Card
          // The process of enrolling an NFC card is defined in section 6.5 of the API docs.
          if (operation === 'enrollNfc') {
            const deviceId = this.getNodeParameter('deviceId', i) as string;
            const resetNfc = this.getNodeParameter('resetNfc', i) as string;

            const options = this.getNodeParameter('optionsEnrollNfc', i) as IDataObject;
            const maxWaitTime = options.maxWaitTime as number ?? 15;

            body["device_id"] = deviceId;
            if (resetNfc) {
              body["reset_ua_card"] = true;
            }

            // First get a sessoin_id
						const sessionResponse = await unifiAccessApiRequest.call(this, 'POST', 'credentials/nfc_cards/sessions', body, {});

            // Now poll the session until the poll token isn't empty.
            let result : IDataObject[] = [];
            let delay: number = 0;
            while (delay < maxWaitTime &&
              (result.length == 0 ||
                result[0].code == "CODE_CREDS_NFC_READ_POLL_TOKEN_EMPTY"))
            {
              // The API specifies 1-second polling intervals.
              await sleep(1000);
              delay += 1;
              result = await unifiAccessApiRequest.call(this, 'GET', `credentials/nfc_cards/sessions/${sessionResponse[0].session_id}`, {}, {}, {returnRaw: true});
            }

            // Delete the session_id before returning.
            await unifiAccessApiRequest.call(this, 'DELETE', `credentials/nfc_cards/sessions/${sessionResponse[0].session_id}`);

            // Return the session result if it didn't time out, or throw an error.
            if (result && result[0].code != "CODE_CREDS_NFC_READ_POLL_TOKEN_EMPTY") {
              responseData = result[0].data;
            } else {
              const errorOptions = {
                message: result[0].code as string,
                description: result[0].msg as string,
              };
              throw new NodeOperationError(this.getNode(), {'message': result[0].code as string} as JsonObject, errorOptions);
            }
          }

          // 6.7 Fetch NFC Card
          if (operation === 'getNfc') {
            const nfcToken = this.getNodeParameter('nfcToken', i) as string;
						responseData = await unifiAccessApiRequest.call(this, 'GET', `credentials/nfc_cards/tokens/${nfcToken}`, {}, {});
          }

          // 6.8 Fetch All NFC Cards
          if (operation === 'getAllNfcs') {
            const {
              limit,
            } = this.getNodeParameter('optionsGetAllNfcs', i, {}) as {
              limit: number;
            };
            if (limit) {
              qs["page_num"] = 1;
              qs["page_size"] = limit;
            }
						responseData = await unifiAccessApiRequest.call(this, 'GET', 'credentials/nfc_cards/tokens', {}, qs);
          }
        }

        // 5. Access Policies
        if (resource === 'accessPolicy') {
          // 5.5 Fetch Access Policy
          if (operation === 'get') {
            const accessPolicyId = this.getNodeParameter('accessPolicyId', i) as string;
						responseData = await unifiAccessApiRequest.call(this, 'GET', `access_policies/${accessPolicyId}`, {}, {});
          }

          // 5.6 Fetch All Access Policies
          if (operation === 'getAll') {
						responseData = await unifiAccessApiRequest.call(this, 'GET', `access_policies`, {}, {});
          }
        }

        // 8. Devices
        if (resource === 'device') {
          // 8.1 Fetch Devices
          if (operation === 'getAll') {
						const grouped = await unifiAccessApiRequest.call(this, 'GET', 'devices', {}, {});
            const flat = grouped.flat();
            const byId = new Map<string, IDataObject>();
            for (const d of flat) {
              const id = d.id as string;
              if (id) byId.set(id, d);
            }
            responseData = [...byId.values()];
          }
        }

        const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
      } catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: { code: error.message, description: error.description }}});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
  }
}
