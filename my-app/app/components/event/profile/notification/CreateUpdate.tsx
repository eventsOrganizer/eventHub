import { supabase } from '../../../../services/supabaseClient';


export async function createUpdate(
  creatorId: string,
  entityType: 'event' | 'personal' | 'local' | 'material' | 'group',
  entityId: number
) {
  try {
    let groupId: number | null = null;
    let groupPrivacy: boolean | null = null;

    // If it's an event, get the associated group
    if (entityType === 'event') {
      const { data: eventData, error: eventError } = await supabase
        .from('event')
        .select('group_id')
        .eq('id', entityId)
        .single();

      if (eventError) throw eventError;

      if (eventData.group_id) {
        groupId = eventData.group_id;
        const { data: groupData, error: groupError } = await supabase
          .from('group')
          .select('privacy')
          .eq('id', groupId)
          .single();

        if (groupError) throw groupError;
        groupPrivacy = groupData.privacy;
      }
    }

    // Get all followers of the creator
    const { data: followers, error: followerError } = await supabase
      .from('follower')
      .select('follower_id')
      .eq('following_id', creatorId);

    if (followerError) throw followerError;

    // Filter followers based on group privacy and membership
    const updates = await Promise.all(followers.map(async (follower) => {
      if (groupId && groupPrivacy) {
        // Check if the follower is a member of the private group
        const { data: memberData, error: memberError } = await supabase
          .from('group_has_user')
          .select('id')
          .eq('group_id', groupId)
          .eq('user_id', follower.follower_id)
          .single();

        if (memberError && memberError.code !== 'PGRST116') {
          throw memberError;
        }

        if (!memberData) {
          return null; // Follower is not a member of the private group
        }
      }

      return {
        follower_id: follower.follower_id,
        [`${entityType}_id`]: entityId,
      };
    }));

    // Filter out null values and insert updates
    const validUpdates = updates.filter(update => update !== null);
    if (validUpdates.length > 0) {
      const { error: insertError } = await supabase
        .from('update')
        .insert(validUpdates);

      if (insertError) throw insertError;
    }

    console.log('Updates created successfully');
  } catch (error) {
    console.error('Error creating updates:', error);
  }
}