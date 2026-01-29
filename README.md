# n8n-nodes-unifi-access

This is an n8n community node. It lets you use the UniFi Access API in your n8n workflows.

UniFi Access is a door control system in the Ubiquiti ecosystem. This node allows you to manage
users, access policies, NFC cards, etc.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

* User Actions
  * Assign access policies to a user
  * Assign NFC card to a user
  * Clear a user's PIN
  * Create a new user
  * Delete a user
  * Get a user
  * Get users
  * Send UniFi Identity invitation
  * Set a user's PIN
  * Unassign an NFC card from a user
  * Update a user
* Access Policy Actions
  * Get an access policy
  * Get access policies
* Credential Actions
  * Delete an NFC card
  * Enroll an NFC card
  * Generate a random PIN
  * Get NFC cards
  * Get an NFC card
* Device Actions
  * Get devices
* Triggers
  * UniFi Access Trigger

## Credentials

Create a new API token in the Settings->General section of the Access dashboard. You'll also need to specify the hostname of your Access server, including the port (usually port 12445). You'll probably also have to adjust your firewall to allow your n8n server to access the API port. 

## Compatibility

Tested again n8n 2.4.8 and UniFi Access 4.1.15.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [UniFi Access API Documentation](https://assets.identity.ui.com/unifi-access/api_reference.pdf)
