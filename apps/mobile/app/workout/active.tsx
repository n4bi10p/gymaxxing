import * as Haptics from 'expo-haptics';
import { useRouter, useFocusEffect } from 'expo-router';
import { usePowerSync } from '@powersync/react-native';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { isAnyPR, type PRFlags } from '@gymaxxing/engine';
import { completeSet, finishWorkout, getOpenWorkoutId, getWorkout, type WorkoutDetail } from '../../src/data/repository';
import { restRemaining, useRest } from '../../src/state/rest';
import { AppText, GlassButton, PrimaryButton, Screen } from '../../src/ui/controls';
import { GlassSurface } from '../../src/ui/GlassSurface';
import { useTheme } from '../../src/ui/ThemeProvider';

export default function ActiveWorkout() {
  const theme = useTheme();
  const router = useRouter();
  const db = usePowerSync();
  const [detail, setDetail] = useState<WorkoutDetail | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { weight: string; reps: string }>>({});
  const [note, setNote] = useState<string | null>(null);
  const endsAt = useRest((state) => state.endsAt);
  const startRest = useRest((state) => state.start);
  const clearRest = useRest((state) => state.clear);
  const [now, setNow] = useState<number | null>(null);

  const load = useCallback(() => {
    void getOpenWorkoutId(db).then(async (id) => {
      if (!id) {
        setDetail(null);
        return;
      }
      const workout = await getWorkout(db, id);
      setDetail(workout);
      if (!workout) return;
      setDrafts((current) => {
        const next = { ...current };
        for (const exercise of workout.exercises) {
          for (const set of exercise.sets) {
            next[set.id] ??= { weight: set.weight ? String(set.weight) : '', reps: set.reps ? String(set.reps) : '' };
          }
        }
        return next;
      });
    });
  }, [db]);
  useFocusEffect(load);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const immediate = setTimeout(tick, 0);
    const timer = setInterval(tick, 500);
    return () => {
      clearTimeout(immediate);
      clearInterval(timer);
    };
  }, []);

  const rest = restRemaining(endsAt, now ?? 0);
  useEffect(() => {
    if (endsAt && rest === 0) clearRest();
  }, [endsAt, rest, clearRest]);

  if (!detail) {
    return (
      <Screen title="Workout" scroll={false}>
        <AppText color={theme.color.text.secondary}>Nothing is in progress.</AppText>
        <PrimaryButton label="Close" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen title={detail.name}>
      {rest > 0 ? (
        <GlassSurface backdrop variant="prominent" style={{ padding: theme.space.lg }}>
          <AppText variant="label" color={theme.color.text.secondary}>
            Rest
          </AppText>
          <AppText variant="display" numeric>
            {rest}s
          </AppText>
        </GlassSurface>
      ) : null}
      {detail.exercises.map((exercise) => (
        <GlassSurface key={exercise.id} variant="regular" style={{ padding: theme.space.md, gap: theme.space.sm }}>
          <AppText variant="cardTitle">{exercise.name}</AppText>
          {exercise.previous ? (
            <AppText variant="bodySmall" color={theme.color.text.tertiary}>
              Last time {exercise.previous}
            </AppText>
          ) : null}
          {exercise.sets.map((set) => {
            const draft = drafts[set.id] ?? { weight: '', reps: '' };
            return (
              <View key={set.id} style={{ flexDirection: 'row', gap: theme.space.sm, alignItems: 'center' }}>
                <TextInput
                  value={draft.weight}
                  keyboardType="decimal-pad"
                  onChangeText={(weight) => setDrafts((current) => ({ ...current, [set.id]: { ...draft, weight } }))}
                  placeholder="kg"
                  placeholderTextColor={theme.color.text.disabled}
                  style={inputStyle(theme.color.text.primary, theme.color.surface.subtle, theme.color.border.default)}
                />
                <TextInput
                  value={draft.reps}
                  keyboardType="number-pad"
                  onChangeText={(reps) => setDrafts((current) => ({ ...current, [set.id]: { ...draft, reps } }))}
                  placeholder="reps"
                  placeholderTextColor={theme.color.text.disabled}
                  style={inputStyle(theme.color.text.primary, theme.color.surface.subtle, theme.color.border.default)}
                />
                <Pressable
                  onPress={() => {
                    const weight = Number(draft.weight);
                    const reps = Number(draft.reps);
                    if (!Number.isFinite(weight) || !Number.isFinite(reps) || reps <= 0) return;
                    void completeSet(db, {
                      setId: set.id,
                      exerciseId: exercise.exerciseId,
                      workoutId: detail.id,
                      weight,
                      reps,
                    }).then((flags: PRFlags) => {
                      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      if (isAnyPR(flags)) setNote('Personal record.');
                      startRest(exercise.restSeconds);
                      load();
                    });
                  }}
                >
                  <AppText variant="label" color={set.completed ? theme.color.semantic.success : theme.color.accent.primary}>
                    {set.completed ? 'Done' : 'Log'}
                  </AppText>
                </Pressable>
              </View>
            );
          })}
        </GlassSurface>
      ))}
      {note ? <AppText color={theme.color.semantic.success}>{note}</AppText> : null}
      <GlassButton label="Add exercise" onPress={() => router.push({ pathname: '/exercise/pick', params: { workoutId: detail.id } })} />
      <PrimaryButton
        label="Finish workout"
        onPress={() => {
          void finishWorkout(db, detail.id).then((message) => {
            clearRest();
            setNote(message);
            router.back();
          });
        }}
      />
    </Screen>
  );
}

function inputStyle(color: string, backgroundColor: string, borderColor: string) {
  return {
    flex: 1,
    color,
    backgroundColor,
    borderColor,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontVariant: ['tabular-nums' as const],
  };
}
