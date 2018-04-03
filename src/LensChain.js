import Lens from './Lens'
import PropertyLens from './PropertyLens'

const setRest = (acc, lenses, value) => {
  if (lenses.length === 0) {
    return value
  }

  const [lens, ...rest] = lenses

  if (rest.length === 0) {
    return lens.set(value, acc)
  } else {
    return lens.set(setRest(lens.view(acc), rest, value), acc)
  }
}

class LensChain extends Lens {
  constructor(...lenses) {
    super()

    this.lenses = lenses
  }

  view() {
    return this.lenses.reduce((acc, lens) => lens.view(acc), null)
  }

  set(value) {
    const [first, ...rest] = this.lenses
    return first.set(setRest(first.view(), rest, value))
  }

  chain(...lenses) {
    return new LensChain(...this.lenses, ...lenses)
  }

  chainProperty(prop) {
    const lens = new PropertyLens(prop)
    return this.chain(lens)
  }
}

export default LensChain
