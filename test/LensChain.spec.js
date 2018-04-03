import { Record } from 'immutable'
import LensChain from '../src/LensChain'
import StateBoundLens from '../src/StateBoundLens'
import PropertyLens from '../src/PropertyLens'

const Address = Record({ country: 'Flatland' })
const Profile = Record({ name: 'username', address: new Address() })
const User = Record({ email: 'email@example.com', profile: new Profile() })

describe('LensChain', () => {
  let user, component

  let userLens, profileLens, addressLens, countryLens
  let userChain, profileChain, addressChain, countryChain

  beforeEach(() => {
    user = new User()
    component = {
      state: { user: user },
      setState: (newState) => {
        component.state = newState
      }
    }

    userLens = new StateBoundLens(component, 'user')
    profileLens = new PropertyLens('profile')
    addressLens = new PropertyLens('address')
    countryLens = new PropertyLens('country')

    userChain = new LensChain(userLens)
    profileChain = userChain.chain(profileLens)
    addressChain = profileChain.chain(addressLens)
    countryChain = addressChain.chain(countryLens)
  })

  describe('#view', () => {
    it('returns a deep part of the state', () => {
      expect(userChain.view()).toEqual(user)
      expect(profileChain.view()).toEqual(user.profile)
      expect(addressChain.view()).toEqual(user.profile.address)
      expect(countryChain.view()).toEqual(user.profile.address.country)
    })
  })

  describe('#set', () => {
    it('sets a deep part of the state', () => {
      countryChain.set('Lapland')
      expect(component.state.user.profile.address.country).toEqual('Lapland')

      addressChain.set('__address__')
      expect(component.state.user.profile.address).toEqual('__address__')

      profileChain.set('__profile__')
      expect(component.state.user.profile).toEqual('__profile__')

      userChain.set('__user__')
      expect(component.state.user).toEqual('__user__')
    })
  })

  describe('#chainProperty', () => {
    it('is an alias to .chain(new PropertyLens(...))', () => {
      const aliased = userChain.
        chainProperty('profile').
        chainProperty('address').
        chainProperty('country')

      expect(aliased.view()).toEqual(user.profile.address.country)
    })
  })
})
