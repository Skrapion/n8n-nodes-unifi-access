import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	JsonObject,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function _unifiAccessApiRequestTest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	url: string,

	body: any = {},
	qs: IDataObject = {},
	option: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('unifiAccessApi');

	let options: IRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'User-Agent': 'n8n',
		},
		method,
		qs,
		body,
		uri: `${credentials.url}/api/v1/developer/${url}`,
		rejectUnauthorized: !credentials.allowUnauthorizedCerts,
		json: true,
	};
	options = Object.assign({}, options, option);
	if (Object.keys(options.body as IDataObject).length === 0) {
		delete options.body;
	}
  let err = "Url: " + options.uri + "\nBody: " + JSON.stringify(options.body) +
    "\nMethod: " + options.method + "\nqs: " + JSON.stringify(options.qs);
  throw new NodeApiError(this.getNode(), {'message': err} as JsonObject);
}

export async function unifiAccessApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	url: string,

	body: any = {},
	qs: IDataObject = {},
	option: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('unifiAccessApi');

	let options: IRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'User-Agent': 'n8n',
		},
		method,
		qs,
		body,
		uri: `${credentials.url}/api/v1/developer/${url}`,
		rejectUnauthorized: !credentials.allowUnauthorizedCerts,
		json: true,
	};
	options = Object.assign({}, options, option);
	if (Object.keys(options.body as IDataObject).length === 0) {
		delete options.body;
	}

  let result;

	try {
		const credentialType = 'unifiAccessApi';
		result = await this.helpers.requestWithAuthentication.call(this, credentialType, options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}

  if (result.code == "SUCCESS") {
    if (result.data) {
      return result.data;
    } else {
      return '';
    }
  } else {
    const errorOptions = {
      message: result.code,
      description: result.msg,
    };
    throw new NodeApiError(this.getNode(), {'message': result.code} as JsonObject, errorOptions);
  }
}

