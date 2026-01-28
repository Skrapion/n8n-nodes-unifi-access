import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription, 
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { unifiAccessApiRequest } from './GenericFunctions';
import { userOperations, userFields } from './UserDescription';

export class UnifiAccess implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Unifi Access',
		name: 'unifiAccess',
		icon: { light: 'file:unifiAccess.svg', dark: 'file:unifiAccess.dark.svg' },
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Unifi Access API',
		defaults: {
			name: 'Unifi Access',
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
				],
				default: 'user',
			},
			...userOperations,
      ...userFields,
		],
	};

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
            const accessPolicyIds = (this.getNodeParameter('accessPolicyIds', i, {}) as IDataObject)
            const accessPolicy = accessPolicyIds.accessPolicy as IDataObject[];
            let accessPolicyIdArray: string[] = [];
            if (accessPolicy) {
              accessPolicyIdArray = accessPolicy.map((h: IDataObject) => h.accessPolicyId as string);
            }
            const overwrite = this.getNodeParameter('overwrite', i) as boolean;

            if (overwrite) {
              body['access_policy_ids'] = accessPolicyIdArray;
            } else {
		          const qs: IDataObject = {};
              qs['expand[]'] = 'access_policy';
              responseData = await unifiAccessApiRequest.call(this, 'GET', `users/${userId}`, {}, qs);
              if (responseData.length == 1) {
                body['access_policy_ids'] = [...new Set(accessPolicyIdArray.concat(responseData[0].access_policy_ids as string[]))];
              }
            }

						responseData = await unifiAccessApiRequest.call(this, 'PUT', `users/${userId}/access_policies`, body, qs);
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
