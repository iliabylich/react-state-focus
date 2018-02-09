const immutable = require('immutable')
const assert = require('assert')
const { Lens, BoundLens, StateBoundLens, PropertyLens, LensChain } = require('./dist/index.js')

const Address = immutable.Record({ country: 'Flatland' })
const Profile = immutable.Record({ name: 'username', address: new Address() })
const User = immutable.Record({ email: 'email@example.com', profile: new Profile() })

describe('Lens', () => {
  it('is abstract', () => {
    const lens = new Lens()
    assert.throws(lens.view, /Lens is an interface/, 'is not abstract')
    assert.throws(lens.set,  /Lens is an interface/, 'is not abstract')
  })
})

describe('BoundLens', () => {
  const object = { k: 'v' }
  const lens = new BoundLens(
    () => object.k,
    (v) => object.k = v
  )

  describe('#view', () => {
    it('is bound to specific object', () => {
      assert.equal(lens.view(), 'v')
    })
  })

  describe('#set', () => {
    it('is bound to specific object', () => {
      lens.set('value2')
      assert.equal(object.k, 'value2')
    })
  })
})

describe('StateBoundLens', () => {
  const component = {
    state: { user: 'user' },
    setState: (newState) => {
      component.state = newState
    }
  }
  const lens = new StateBoundLens(component, 'user')

  describe('#view', () => {
    it('returns a part of the state', () => {
      assert.equal(lens.view(), 'user')
    })
  })

  describe('#set', () => {
    it('sets a part of the state', () => {
      lens.set('user2')
      assert.equal(lens.view(), 'user2')
    })
  })
})

describe('PropertyLens', () => {
  const address = new Address()
  const lens = new PropertyLens('country')

  describe('#view', () => {
    it('gets a property from the specified object', () => {
      assert.equal(lens.view(address), 'Flatland')
    })
  })

  describe('#set', () => {
    it('sets a property on the specified object', () => {
      const newAddress = lens.set('Lapland', address)
      assert.equal(lens.view(newAddress), 'Lapland')
    })
  })
})

describe('LensChain', () => {
  const user = new User()
  const component = {
    state: { user: user },
    setState: (newState) => {
      component.state = newState
    }
  }

  const userLens = new StateBoundLens(component, 'user')
  const profileLens = new PropertyLens('profile')
  const addressLens = new PropertyLens('address')
  const countryLens = new PropertyLens('country')

  const userChain = new LensChain(userLens)
  const profileChain = userChain.chain(profileLens)
  const addressChain = profileChain.chain(addressLens)
  const countryChain = addressChain.chain(countryLens)

  describe('#view', () => {
    it('returns a deep part of the state', () => {
      assert.equal(userChain.view(), user)
      assert.equal(profileChain.view(), user.profile)
      assert.equal(addressChain.view(), user.profile.address)
      assert.equal(countryChain.view(), user.profile.address.country)
    })
  })

  describe('#set', () => {
    it('sets a deep part of the state', () => {
      countryChain.set('Lapland')
      assert.equal(component.state.user.profile.address.country, 'Lapland')

      addressChain.set('__address__')
      assert.equal(component.state.user.profile.address, '__address__')

      profileChain.set('__profile__')
      assert.equal(component.state.user.profile, '__profile__')

      userChain.set('__user__')
      assert.equal(component.state.user, '__user__')
    })
  })
})
