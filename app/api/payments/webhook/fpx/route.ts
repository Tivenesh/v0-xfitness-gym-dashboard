// File: app/api/payments/webhook/fpx/route.ts

import { supabaseServer } from '@/lib/supabaseServer'; // Use the service role client for backend operations
import { NextResponse } from 'next/server';
import { headers } from 'next/headers'; // To access request headers

// IMPORTANT: Replace this with your actual webhook secret from the payment gateway
const WEBHOOK_SECRET = process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET || 'YOUR_SECRET_HERE';

export async function POST(request: Request) {
  const body = await request.text(); // Read the raw body as text for signature verification
  const headersList = headers();
  // --- This header name depends on your specific payment gateway ---
  const signature = headersList.get('your-gateway-signature-header'); // e.g., 'Billplz-Signature', 'Stripe-Signature'

  console.log('Webhook received!'); // Log that the webhook was hit

  // --- 1. Verify the Webhook Signature ---
  // This is crucial for security! The exact method depends on your gateway.
  // You'll typically use a library or crypto functions to compare the
  // received signature with one you calculate using the raw body and your secret.
  const isValidSignature = verifySignature(body, signature, WEBHOOK_SECRET); // Placeholder function

  if (!isValidSignature) {
    console.error('Invalid webhook signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // If signature is valid, parse the body
  let eventData;
  try {
    eventData = JSON.parse(body);
    console.log('Webhook Event Data:', eventData);
  } catch (error) {
    console.error('Error parsing webhook JSON:', error);
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  // --- 2. Process the Event ---
  // Extract relevant info (payment ID, status) - ADJUST THESE KEYS based on your gateway's payload
  const paymentIdFromGateway = eventData.id; // Or eventData.payment_id, eventData.transaction_id etc.
  const paymentStatus = eventData.status; // Or eventData.paid, eventData.state etc. (Map to 'Success' or 'Failed')
  const memberId = eventData.metadata?.member_id; // Assuming you pass member_id in metadata

  if (!paymentIdFromGateway || !paymentStatus || !memberId) {
      console.error('Missing required data in webhook payload');
      return NextResponse.json({ error: 'Missing payment ID, status, or member ID' }, { status: 400 });
  }

  const finalStatus = mapGatewayStatus(paymentStatus); // Convert gateway status ('paid', 'failed') to 'Success' or 'Failed'

  try {
    // --- 3. Update Payment Status in DB ---
    const { data: updatedPayment, error: paymentError } = await supabaseServer
      .from('payments')
      .update({ status: finalStatus })
      // Match using the correct ID field. You might need to add a 'gateway_payment_id' column
      // if the gateway ID is different from your internal payment ID.
      .eq('id', paymentIdFromGateway) // Or .eq('gateway_payment_id', paymentIdFromGateway)
      .select()
      .single();

    if (paymentError) throw paymentError;
    if (!updatedPayment) throw new Error('Payment record not found or failed to update');

    console.log(`Payment ${paymentIdFromGateway} updated to ${finalStatus}`);

    // --- 4. Update Member Status if Payment Successful ---
    if (finalStatus === 'Success') {
      // Fetch the plan details to know the duration
      const { data: planDetails, error: planError } = await supabaseServer
          .from('membership_plans') // Assumes you have this table
          .select('duration_months')
          .eq('name', updatedPayment.plan_name) // Match plan by name from the payment record
          .single();

      if (planError || !planDetails) {
          console.error("Could not find plan details for:", updatedPayment.plan_name);
          // Decide if this is a critical error or if you can proceed without updating end_date
      } else {
        const durationMonths = planDetails.duration_months;
        const newEndDate = new Date();
        newEndDate.setMonth(newEndDate.getMonth() + durationMonths);

        const { error: memberError } = await supabaseServer
          .from('members')
          .update({
            status: 'Active',
            end_date: newEndDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
          })
          .eq('id', memberId); // Use the memberId from the webhook metadata

        if (memberError) throw memberError;
        console.log(`Member ${memberId} status updated to Active, end_date set to ${newEndDate.toISOString().split('T')[0]}`);
      }
    }

    // --- 5. Respond to the Gateway ---
    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Error processing webhook:', error.message);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

// --- Placeholder: Implement actual signature verification ---
// Consult your payment gateway's documentation for the correct method
// (e.g., using crypto.createHmac in Node.js)
function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  // --- Replace with actual verification logic ---
  // Example (conceptual, requires library like `crypto`):
  // const expectedSignature = crypto.createHmac('sha256', secret)
  //                               .update(rawBody)
  //                               .digest('hex');
  // return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  console.warn('Webhook signature verification is not fully implemented!'); // REMOVE IN PRODUCTION
  return true; // TEMPORARY: Assume valid for testing
}

// --- Helper: Map gateway status to your internal status ---
function mapGatewayStatus(gatewayStatus: string): 'Success' | 'Failed' | 'Pending' {
    // Adjust these based on your gateway's actual status codes/strings
    const lowerStatus = gatewayStatus.toLowerCase();
    if (lowerStatus === 'paid' || lowerStatus === 'success' || lowerStatus === 'completed') {
        return 'Success';
    } else if (lowerStatus === 'failed' || lowerStatus === 'error' || lowerStatus === 'cancelled') {
        return 'Failed';
    }
    return 'Pending'; // Default or if status is unclear
}