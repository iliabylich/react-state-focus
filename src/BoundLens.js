import Lens from './Lens'

class BoundLens extends Lens {
  constructor(get, set) {
    super()

    this.get = get
    this.set = set
  }

  view() {
    return this.get()
  }

  set(value) {
    return this.set(value)
  }
}

export default BoundLens
