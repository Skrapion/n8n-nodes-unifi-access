import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
        resource: ['user'],
      },
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a new user',
				description: 'Create a new user',
			},
      {
        name: 'Update',
        value: 'update',
        action: 'Update a user',
        description: 'Update a user',
      },
			{
				name: 'Get',
				value: 'get',
				action: 'Get a user',
				description: 'Get the data of a single user',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get users',
				description: 'Get many users',
			},
      {
        name: 'Assign Access Policy',
        value: 'assignAccessPolicy',
        action: 'Assign Access Policy to User',
        description: 'Assign access policies to a user',
      },
		],
		default: 'getAll',
	},
];

export const userFields: INodeProperties[] = [
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: '',
    required: true,
		displayOptions: { 
      show: {
        resource: ['user'],
        operation: ['get', 'update', 'assignAccessPolicy']
      },
    },
		description: "The user's id",
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
        resource: ['user'],
        operation: ['create'],
      },
		},
		description: 'The first name of the user',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
        resource: ['user'],
        operation: ['create'],
      },
		},
		description: 'The last name of the user',
	},
	{
		displayName: 'First Name',
		name: 'firstNameOpt',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
        resource: ['user'],
        operation: ['update'],
      },
		},
		description: 'The first name of the user',
	},
	{
		displayName: 'Last Name',
		name: 'lastNameOpt',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
        resource: ['user'],
        operation: ['update'],
      },
		},
		description: 'The last name of the user',
	},
	{
		displayName: 'Email address',
		name: 'email',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
        resource: ['user'],
        operation: ['create', 'update'],
      },
		},
		description: 'The email address of the user',
	},
	{
		displayName: 'Employee Number',
		name: 'employeeNumber',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
        resource: ['user'],
        operation: ['create', 'update'],
      },
		},
		description: 'The employee number of the user',
	},
	{
		displayName: 'Onboarding Date',
		name: 'onboardTime',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
        resource: ['user'],
        operation: ['create', 'update'],
      },
		},
		description: 'The user onboarding date',
	},
  {
    displayName: 'Status',
    name: 'status',
    type: 'options',
    default: '',
    options: [
      {
        name: '',
        value: '',
      },
      {
        name: 'Active',
        value: 'ACTIVE',
      },
      {
        name: 'Deactivated',
        value: 'DEACTIVATED',
      },
    ],
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['update'],
      },
    },
    description: 'Status of the user',
  },
  {
    displayName: 'Options',
    name: 'optionsGet',
    type: 'collection',
    placeholder: 'Add option',
    default: {},
    options: [
      {
        displayName: 'Expand access policies?',
        name: 'expandAccessPolicies',
        type: 'boolean',
        default: false,
        description: "Whether or not to retrieve the access policies for the user",
      },
    ],
    displayOptions: { 
      show: {
        resource: ['user'],
        operation: ['get'],
      },
    },
  },
  {
    displayName: 'Options',
    name: 'optionsGetAll',
    type: 'collection',
    placeholder: 'Add option',
    default: {},
    options: [
      {
        displayName: 'Expand access policies?',
        name: 'expandAccessPolicies',
        type: 'boolean',
        default: false,
        description: "Whether or not to retrieve the access policies for the user",
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 0,
        description: 'How many users to return',
      }
    ],
    displayOptions: { 
      show: {
        resource: ['user'],
        operation: ['getAll'],
      },
    },
  },
  {
    displayName: 'Access Policy IDs',
    name: 'accessPolicyIds',
    type: 'fixedCollection',
    placeholder: 'Add Policy',
    default: '',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['assignAccessPolicy'],
      },
    },
    typeOptions: {
      multipleValues: true,
    },
    options: [
      {
        displayName: 'Access Policy IDs',
        name: 'accessPolicy',
        values: [
          {
            displayName: 'Access Policy ID',
            name: 'accessPolicyId',
            type: 'string',
            default: '',
          }
        ],
      },
    ],
    description: 'The IDs of the access policies to assign to the user',
  },
  {
    displayName: 'Overwrite Existing Policies',
    name: 'overwrite',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['assignAccessPolicy'],
      },
    },
  },
];
