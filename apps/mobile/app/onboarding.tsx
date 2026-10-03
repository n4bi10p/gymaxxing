import { useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react-native';
import { useState } from 'react';
import { PRESET_SEEDS } from '@gymaxxing/theme';
import { saveProfile } from '../src/data/repository';
import { AppText, Chip, Field, PrimaryButton, Row, Screen } from '../src/ui/controls';
import { useAppearance } from '../src/ui/ThemeProvider';

const GOALS = ['Strength', 'Muscle', 'General fitness'];

export default function Onboarding() {
  const router = useRouter();
  const db = usePowerSync();
  const { appearance, setAppearance } = useAppearance();
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(GOALS[0] ?? 'Strength');
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');

  return (
    <Screen title="Set up">
      <AppText variant="bodySmall">A few choices. You can change them later.</AppText>
      <Field value={name} onChangeText={setName} placeholder="Name" />
      <Row>
        {GOALS.map((item) => (
          <Chip key={item} label={item} selected={goal === item} onPress={() => setGoal(item)} />
        ))}
      </Row>
      <Row>
        <Chip label="Kilograms" selected={unit === 'kg'} onPress={() => setUnit('kg')} />
        <Chip label="Pounds" selected={unit === 'lb'} onPress={() => setUnit('lb')} />
      </Row>
      <Row>
        <Chip label="System theme" selected={appearance.scheme === 'system'} onPress={() => setAppearance({ scheme: 'system' })} />
        <Chip label="Dark" selected={appearance.scheme === 'dark'} onPress={() => setAppearance({ scheme: 'dark' })} />
        <Chip label="Light" selected={appearance.scheme === 'light'} onPress={() => setAppearance({ scheme: 'light' })} />
      </Row>
      <Row>
        <Chip label="Silver" selected={appearance.accent.kind === 'silver'} onPress={() => setAppearance({ accent: { kind: 'silver' } })} />
        {(Object.keys(PRESET_SEEDS) as (keyof typeof PRESET_SEEDS)[]).map((id) => (
          <Chip
            key={id}
            label={id}
            selected={appearance.accent.kind === 'preset' && appearance.accent.id === id}
            onPress={() => setAppearance({ accent: { kind: 'preset', id } })}
          />
        ))}
      </Row>
      <PrimaryButton
        label="Continue"
        onPress={() => {
          const accentKind = appearance.accent.kind === 'preset' ? appearance.accent.id : appearance.accent.kind;
          void saveProfile(db, {
            name: name.trim(),
            goal,
            experience: 'intermediate',
            trainingDays: [1, 3, 5],
            unit,
            scheme: appearance.scheme,
            accentKind,
            accentSeed: appearance.accent.kind === 'custom' ? appearance.accent.seed : null,
            restSeconds: 120,
          }).then(() => router.replace('/(tabs)'));
        }}
      />
    </Screen>
  );
}
