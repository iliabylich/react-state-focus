class Lens {
  constructor() {
    this.view = this.view.bind(this)
    this.set = this.set.bind(this)
  }

  view() {
    throw new Error('Lens is an interface')
  }

  set(value) {
    throw new Error('Lens is an interface')
  }
}

export default Lens
