import { useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react-native';
import { useEffect } from 'react';
import { getProfile } from '../src/data/repository';

export default function Index() {
  const router = useRouter();
  const db = usePowerSync();
  useEffect(() => {
    void getProfile(db).then((profile) => {
      router.replace(profile ? '/(tabs)' : '/onboarding');
    });
  }, [db, router]);
  return null;
}
