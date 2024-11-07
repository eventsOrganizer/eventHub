import { supabase } from "../../services/supabaseClient";
import { useUser } from "../../UserContext";

export const fetchEventsByUserInterests = async (userId: string | null, selectedInterests: string[] = []) => {
    try {
        let subcategoryIds: number[] = [];

        if (userId) {
            // For logged-in users: fetch from interest table
            const { data: userInterests, error: interestError } = await supabase
                .from('interest')
                .select('subcategory_id')
                .eq('user_id', userId);

            if (interestError) {
                console.error('Error fetching user interests:', interestError);
                return [];
            }
            subcategoryIds = userInterests?.map(interest => interest.subcategory_id) || [];
            // console.log('Fetched DB interests:', subcategoryIds);
        } else if (selectedInterests.length > 0) {
            // For non-logged users: use context interests
            subcategoryIds = selectedInterests.map(id => parseInt(id));
            // console.log('Using context interests:', subcategoryIds);
        }

        if (subcategoryIds.length === 0) {
            console.log('No interests found');
            return [];
        }

        const { data: events, error: eventError } = await supabase
            .from('event')
            .select(`
                *,
                subcategory!inner (
                    id, name,
                    category (id, name)
                ),
                location (id, longitude, latitude),
                availability (id, start, end, daysofweek, date),
                media (url)
            `)
            .in('subcategory_id', subcategoryIds);

        if (eventError) {
            console.error('Error fetching events:', eventError);
            return [];
        }

        return events || [];

    } catch (error) {
        console.error('Error in fetchEventsByUserInterests:', error);
        return [];
    }
};