import React from 'react'

const LensBoundComponent = (WrappedComponent) => {
  const Wrapper = class extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
      const current = this.lensResolvesTo
      const next = nextProps.lens.view()
      const shouldUpdate = current !== next

      if (shouldUpdate) {
        this.lensResolvesTo = next
      }
      return shouldUpdate
    }

    render() {
      this.lensResolvesTo = this.props.lens.view()
      return <WrappedComponent {...this.props} />
    }
  }
  Wrapper.propTypes = WrappedComponent.propTypes
  Wrapper.displayName = `LensBoundComponent(${WrappedComponent.name})`

  return Wrapper
}

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

class StateBoundLens extends BoundLens {
  constructor(component, statePart) {
    const get = () => component.state[statePart]
    const set = (value) => {
      const state = {}
      state[statePart] = value
      return component.setState(state)
    }

    super(get, set)
  }
}

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

export {
  Lens,
  BoundLens,
  StateBoundLens,
  PropertyLens,
  LensChain,
  LensBoundComponent
}
