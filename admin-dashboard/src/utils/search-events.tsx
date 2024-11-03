import { Event } from "../types/event";

export function searchEvents(events: Event[], query: string): Event[] {
    if (!query) return events;

    const lowerCaseQuery = query.toLowerCase();

    return events.filter(event => 
        event.name.toLowerCase().includes(lowerCaseQuery) ||
        event.details.toLowerCase().includes(lowerCaseQuery)
    );
}