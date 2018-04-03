import { Record } from 'immutable'
import PropertyLens from '../src/PropertyLens'

const Address = Record({ country: 'Flatland' })

describe('PropertyLens', () => {
  let address, lens

  beforeEach(() => {
    address = new Address()
    lens = new PropertyLens('country')
  })

  describe('#view', () => {
    it('gets a property from the specified object', () => {
      expect(lens.view(address)).toEqual('Flatland')
    })
  })

  describe('#set', () => {
    it('sets a property on the specified object', () => {
      const newAddress = lens.set('Lapland', address)
      expect(lens.view(newAddress)).toEqual('Lapland')
    })
  })
})
