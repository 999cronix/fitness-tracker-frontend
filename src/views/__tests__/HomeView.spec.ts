// Test für HomeView: prüft, ob die Startseite alle Demo-Einträge als Liste zeigt.
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import WorkoutItem from '@/components/WorkoutItem.vue'

describe('HomeView', () => {
  it('zeigt die drei Demo-Einträge als Listenpunkte', () => {
    const wrapper = mount(HomeView)

    expect(wrapper.findAll('li')).toHaveLength(3)
    expect(wrapper.findAllComponents(WorkoutItem)).toHaveLength(3)
    expect(wrapper.text()).toContain('Deadlift')
  })
})
