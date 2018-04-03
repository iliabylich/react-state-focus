import BoundLens from '../src/BoundLens'

describe('BoundLens', () => {
  let object, lens

  beforeEach(() => {
    object = { k: 'v' }
    lens = new BoundLens(
      () => object.k,
      (v) => object.k = v
    )
  })

  describe('#view', () => {
    it('is bound to specific object', () => {
      expect(lens.view()).toEqual('v')
    })
  })

  describe('#set', () => {
    it('is bound to specific object', () => {
      lens.set('value2')
      expect(lens.view()).toEqual('value2')
    })
  })
})
