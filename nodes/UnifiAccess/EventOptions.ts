import type { INodePropertyOptions } from 'n8n-workflow';

export const eventOptions: INodePropertyOptions[] = [
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
];
