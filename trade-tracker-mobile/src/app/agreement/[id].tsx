import { useLocalSearchParams } from 'expo-router';

import AgreementDetailView from '@/components/agreement-detail-view';

export default function AgreementScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <AgreementDetailView id={id ?? ''} />;
}
