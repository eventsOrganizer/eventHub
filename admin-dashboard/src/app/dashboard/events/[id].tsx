import * as React from 'react';
import { useRouter } from 'next/router';
import { EventDetail } from '../../../components/dashboard/events/eventDetail';

export default function EventDetailPage(): React.JSX.Element {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== 'string') {
    return <div>Loading...</div>;
  }

  return <EventDetail eventId={id} />;
}