import { createHmac, timingSafeEqual } from 'crypto';
import type { IWebhookFunctions } from 'n8n-workflow';

/**
 * Verifies the Unifi Access webhook signature using HMAC-SHA256.
 *
 * Unifi Access sends a signature in the `Signature` header in the format:
 * `t=<timestamp>,v1=<HMAC hex digest>`
 *
 * This function computes the expected signature using the stored webhook secret
 * and compares it with the provided signature using a constant-time comparison.
 *
 * @returns true if signature is valid or no secret is configured, false otherwise
 */
export function verifySignature(this: IWebhookFunctions): boolean {
	// Get the secret from workflow static data (set during webhook creation)
	const webhookData = this.getWorkflowStaticData('node');
	const webhookSecret = webhookData.webhookSecret as string | undefined;

	// If no secret is configured, fail
	if (!webhookSecret) {
		return false;
	}

	const req = this.getRequestObject();

	// Get the signature from GitHub's header
	const signature = req.header('Signature');
	if (!signature) {
		return false;
	}

	// Validate signature format
  const parts = Object.fromEntries(
    signature.split(',').map((kv: string) => {
      const [k, v] = kv.split('=');
      return [k.trim(), v.trim()];
    }),
  );

	if (!parts.t || !parts.v1) {
		return false;
	}

  // Timestamp tolerance check
  const now = Math.floor(Date.now() / 1000);
  const t = Number(parts.t);
  if (!Number.isFinite(t) || Math.abs(now - t) > 300) {
    return false;
  }

	try {
		// Get the raw request body
		if (!req.rawBody) {
			return false;
		}

	  const signedPayload = `${parts.t}.${req.rawBody}`


    const hmac = createHmac('sha256', webhookSecret);
    hmac.update(signedPayload, 'utf8');
    const computedSignature = hmac.digest('hex');

    const computedBuffer = Buffer.from(computedSignature, 'utf8');
    const providedBuffer = Buffer.from(parts.v1, 'utf8');

    // Buffers must be same length for timingSafeEqual
		if (computedBuffer.length !== providedBuffer.length) {
			return false;
		}

		return timingSafeEqual(computedBuffer, providedBuffer);
	} catch {
		return false;
	}
}
