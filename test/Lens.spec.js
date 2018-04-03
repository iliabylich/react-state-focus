import Lens from '../src/Lens'

describe('Lens', () => {
  it('is abstract', () => {
    const lens = new Lens()

    expect(lens.view).toThrowError('Lens is an interface')
    expect(lens.set).toThrowError('Lens is an interface')
  })
})
