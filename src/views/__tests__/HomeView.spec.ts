// Test für HomeView: fetch wird gemockt, also nicht echt ans Backend geschickt.
// Geprüft wird, ob die Liste nach dem Laden erscheint, ob ein Fehler sichtbar wird
// und ob ein neu gespeicherter Eintrag oben in der Liste landet.
import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import WorkoutItem from '@/components/WorkoutItem.vue'

describe('HomeView', () => {
  // Nach jedem Test den gemockten fetch wieder entfernen, damit sich Tests nicht gegenseitig beeinflussen.
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('zeigt die drei Einträge aus dem Backend als Listenpunkte', async () => {
    // Antwort, die so aussieht, als käme sie vom Backend.
    const entries = [
      { id: 1, date: '2026-10-05', exercise: 'Bench Press', weightKg: 60, reps: 8 },
      { id: 2, date: '2026-10-05', exercise: 'Squat', weightKg: 80, reps: 5 },
      { id: 3, date: '2026-10-07', exercise: 'Deadlift', weightKg: 100, reps: 5 },
    ]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => entries }))

    const wrapper = mount(HomeView)
    // Wartet, bis der fetch-Aufruf und das Rendern abgeschlossen sind.
    await flushPromises()

    expect(wrapper.findAll('li')).toHaveLength(3)
    expect(wrapper.findAllComponents(WorkoutItem)).toHaveLength(3)
    expect(wrapper.text()).toContain('Deadlift')
  })

  it('zeigt eine Fehlermeldung, wenn das Backend mit 500 antwortet', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    const wrapper = mount(HomeView)
    await flushPromises()

    expect(wrapper.text()).toContain('Fehler beim Laden')
    expect(wrapper.findAll('li')).toHaveLength(0)
  })

  it('zeigt "Noch keine Einträge.", wenn das Backend eine leere Liste liefert', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))

    const wrapper = mount(HomeView)
    await flushPromises()

    expect(wrapper.text()).toContain('Noch keine Einträge.')
    expect(wrapper.findAll('li')).toHaveLength(0)
  })

  it('zeigt den neu gespeicherten Eintrag oben in der Liste', async () => {
    // Die Antwort auf GET ist leer. Die Antwort auf POST ist der gespeicherte Eintrag mit id.
    const created = { id: 4, date: '2026-10-24', exercise: 'Deadlift', weightKg: 100, reps: 5 }
    const fetchMock = vi.fn<(url: string, init?: RequestInit) => Promise<unknown>>(
      async (_url, init) => {
        if (init?.method === 'POST') {
          return { ok: true, status: 201, json: async () => created }
        }
        return { ok: true, status: 200, json: async () => [] }
      },
    )
    vi.stubGlobal('fetch', fetchMock)

    const wrapper = mount(HomeView)
    await flushPromises()

    await wrapper.get('#workout-exercise').setValue('Deadlift')
    await wrapper.get('#workout-weight').setValue('100')
    await wrapper.get('#workout-reps').setValue('5')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.findAll('li')).toHaveLength(1)
    expect(wrapper.text()).toContain('Deadlift')
    expect(wrapper.text()).not.toContain('Noch keine Einträge.')
  })
})
