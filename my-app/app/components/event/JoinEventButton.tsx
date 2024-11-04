import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useUser } from '../../UserContext';
import { theme } from '../../../lib/theme';
import { ButtonWrapper } from './buttons/ButtonWrapper';
import { useJoinEvent } from './buttons/useJoinEvent';

interface JoinEventButtonProps {
  eventId: number;
  privacy: boolean;
  organizerId: string;
  onJoinSuccess: () => void;
  onLeaveSuccess: () => void;
}

const JoinEventButton: React.FC<JoinEventButtonProps> = ({ 
  eventId, 
  privacy, 
  organizerId, 
  onJoinSuccess, 
  onLeaveSuccess 
}) => {
  const { userId } = useUser();
  const { isJoined, isPending, handleJoin, handleLeave } = useJoinEvent({
    eventId,
    privacy,
    userId,
    organizerId,
    onJoinSuccess,
    onLeaveSuccess,
  });

  if (isJoined) {
    return (
      <ButtonWrapper style={styles.joinedButton} onPress={handleLeave}>
        <Text style={styles.buttonText}>Joined</Text>
      </ButtonWrapper>
    );
  }

  if (isPending) {
    return (
      <ButtonWrapper style={styles.pendingButton} disabled>
        <Text style={styles.buttonText}>Request Pending</Text>
      </ButtonWrapper>
    );
  }

  return (
    <ButtonWrapper style={styles.joinButton} onPress={handleJoin}>
      <Text style={styles.buttonText}>
        {privacy ? 'Request to Join' : 'Join Event'}
      </Text>
    </ButtonWrapper>
  );
};

const styles = StyleSheet.create({
  joinButton: {
    backgroundColor: theme.colors.accent,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  joinedButton: {
    backgroundColor: theme.colors.secondary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pendingButton: {
    backgroundColor: theme.colors.accent,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    color: theme.colors.primary,
    ...theme.typography.body,
    fontWeight: 'bold',
  },
});

export default JoinEventButton;