// Example: lib/activityLogger.ts
import { supabaseServer } from '@/lib/supabaseServer'; // Use the service role client

export async function logAdminActivity(
    adminUserId: string,
    adminEmail: string | undefined, // Pass the email from the session
    action: string, // Description of the action
    resourceType?: string, // Type of resource affected (optional)
    resourceId?: string | number, // ID of the resource affected (optional)
    details?: object // Extra JSON data (optional)
) {
  try {
    const { error } = await supabaseServer.from('admin_activity_log').insert({
      admin_user_id: adminUserId,
      admin_email: adminEmail || 'Unknown', // Store email for easier display
      action_description: action,
      target_resource_type: resourceType,
      target_resource_id: resourceId ? String(resourceId) : undefined, // Ensure ID is stored as string
      details: details,
    });
    if (error) {
      console.error('Failed to log admin activity:', error);
      // Depending on importance, you might want to throw or just log
    }
  } catch (logError) {
    console.error('Exception during admin activity logging:', logError);
  }
}