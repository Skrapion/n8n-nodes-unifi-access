import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	JsonObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
//import util from 'util';

export async function unifiAccessApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	url: string,

	body: IDataObject | IDataObject[] = {},
	qs: IDataObject = {},
	option: IDataObject = {},
): Promise<IDataObject[]> {
	const credentials = await this.getCredentials('unifiAccessApi');

	let options: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'User-Agent': 'n8n',
		},
		method,
		qs,
		body,
		url: `${credentials.url}/api/v1/developer/${url}`,
		skipSslCertificateValidation: credentials.allowUnauthorizedCerts as boolean,
		json: true,
	};

  /*
  console.log("Url: ", options.url);
  console.log("Body: ", JSON.stringify(options.body));
  console.log("Method: ", options.method);
  console.log("qs: ", JSON.stringify(options.qs));
  */

	options = Object.assign({}, options, option);
	if (Object.keys(options.body as IDataObject).length === 0) {
		delete options.body;
	}

  let result;

	try {
		const credentialType = 'unifiAccessApi';
		result = await this.helpers.httpRequestWithAuthentication.call(this, credentialType, options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}

  if (result.code == "SUCCESS") {
    //console.log("Result: ", util.inspect(result, {depth: null, colors: true}));
    if (result.data) {
      if (Array.isArray(result.data)) {
        if (result.data.length == 0) {
          return [{}];
        } else {
          return result.data;
        }
      } else if (option.resultName) {
        return [{[option.resultName as string]: result.data}];
      } else {
        return [result.data];
      }
    } else {
      return [{}];
    }
  } else {
    const errorOptions = {
      message: result.code,
      description: result.msg,
    };
    throw new NodeApiError(this.getNode(), {'message': result.code} as JsonObject, errorOptions);
  }
}

