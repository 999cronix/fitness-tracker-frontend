// Test für WorkoutForm: fetch wird gemockt, also nicht echt ans Backend geschickt.
// Geprüft wird der Sendeweg (POST mit dem richtigen Body), die Prüfung leerer Eingaben und die Fehlermeldung.
import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import WorkoutForm from '../WorkoutForm.vue'

describe('WorkoutForm', () => {
  // Nach jedem Test den gemockten fetch wieder entfernen, damit sich Tests nicht gegenseitig beeinflussen.
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('schickt einen POST mit den Eingaben (ohne id) und meldet den gespeicherten Eintrag', async () => {
    // Antwort, die so aussieht, als käme sie vom Backend (mit id).
    const saved = { id: 7, date: '2026-10-24', exercise: 'Bench Press', weightKg: 60, reps: 8 }
    const fetchMock = vi
      .fn<(...args: unknown[]) => unknown>()
      .mockResolvedValue({ ok: true, status: 201, json: async () => saved })
    vi.stubGlobal('fetch', fetchMock)

    const wrapper = mount(WorkoutForm)
    // setValue setzt den Wert eines Feldes und löst die Eingabe aus, so wie ein Nutzer es täte.
    await wrapper.get('#workout-exercise').setValue('Bench Press')
    await wrapper.get('#workout-weight').setValue('60')
    await wrapper.get('#workout-reps').setValue('8')
    await wrapper.get('#workout-date').setValue('2026-10-24')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url.endsWith('/workouts')).toBe(true)
    expect(options.method).toBe('POST')
    expect(options.headers).toEqual({ 'Content-Type': 'application/json' })
    // Der Body ist JSON-Text. Wir lesen ihn zurück und prüfen die Felder.
    const body = JSON.parse(options.body as string)
    expect(body).toEqual({ exercise: 'Bench Press', date: '2026-10-24', weightKg: 60, reps: 8 })
    expect(body).not.toHaveProperty('id')

    expect(wrapper.emitted('created')).toEqual([[saved]])
  })

  it('schickt nichts ab und zeigt eine Meldung, wenn die Übung leer ist', async () => {
    const fetchMock = vi.fn<(...args: unknown[]) => unknown>()
    vi.stubGlobal('fetch', fetchMock)

    const wrapper = mount(WorkoutForm)
    await wrapper.get('#workout-exercise').setValue('')
    await wrapper.get('#workout-weight').setValue('60')
    await wrapper.get('#workout-reps').setValue('8')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(fetchMock).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Bitte alle Felder korrekt ausfüllen.')
  })

  it('zeigt die Fehlermeldung des Backends, wenn die Antwort 400 ist', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 400 }))

    const wrapper = mount(WorkoutForm)
    await wrapper.get('#workout-exercise').setValue('Squat')
    await wrapper.get('#workout-weight').setValue('80')
    await wrapper.get('#workout-reps').setValue('5')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toBe('Die Eingabe ist ungültig.')
    expect(wrapper.emitted('created')).toBeUndefined()
  })
})
