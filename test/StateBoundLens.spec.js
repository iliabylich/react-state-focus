import StateBoundLens from '../src/StateBoundLens'

describe('StateBoundLens', () => {
  let component, lens

  beforeEach(() => {
    component = {
      state: { user: 'user' },
      setState: (newState) => {
        component.state = newState
      }
    }
    lens = new StateBoundLens(component, 'user')
  })

  describe('#view', () => {
    it('returns a part of the state', () => {
      expect(lens.view()).toEqual('user')
    })
  })

  describe('#set', () => {
    it('sets a part of the state', () => {
      lens.set('user2')
      expect(lens.view()).toEqual('user2')
    })
  })
})
