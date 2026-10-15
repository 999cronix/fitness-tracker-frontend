// Test für WorkoutList: prüft, ob jeder Eintrag als WorkoutItem gerendert wird.
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WorkoutList from '../WorkoutList.vue'
import WorkoutItem from '../WorkoutItem.vue'

describe('WorkoutList', () => {
  it('rendert für jeden Eintrag ein WorkoutItem', () => {
    const wrapper = mount(WorkoutList, {
      props: {
        entries: [
          { id: 1, date: '2026-10-05', exercise: 'Bench Press', weightKg: 60, reps: 8 },
          { id: 2, date: '2026-10-05', exercise: 'Squat', weightKg: 80, reps: 5 },
        ],
      },
    })

    expect(wrapper.findAllComponents(WorkoutItem)).toHaveLength(2)
    expect(wrapper.text()).toContain('Bench Press')
  })
})
