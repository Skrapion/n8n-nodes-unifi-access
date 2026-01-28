# n8n-nodes-unifi-access

This is an n8n community node. It lets you use the UniFi Access API in your n8n workflows.

UniFi Access is a door control system in the Ubiquiti ecosystem. This node allows you to manage
users, access policies, NFC cards, etc.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

_List the operations supported by your node._

## Credentials

Create a new API token in the Settings->General section of the Access dashboard. You'll also need to specify the hostname of your Access server, including the port (usually port 12445). You'll probably also have to adjust your firewall to allow your n8n server to access the API port. 

## Compatibility

_State the minimum n8n version, as well as which versions you test against. You can also include any known version incompatibility issues._

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [UniFi Access API Documentation](https://assets.identity.ui.com/unifi-access/api_reference.pdf)
