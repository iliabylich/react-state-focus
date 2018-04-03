import Lens from './Lens'

class PropertyLens extends Lens {
  constructor(prop) {
    super()

    this.prop = prop
  }

  view(obj) {
    return obj[this.prop]
  }

  set(value, obj) {
    return obj.set(this.prop, value)
  }
}

export default PropertyLens
