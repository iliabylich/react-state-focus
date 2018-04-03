import BoundLens from './BoundLens'

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

export default StateBoundLens
