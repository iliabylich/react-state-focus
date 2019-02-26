import { Component } from 'react'
import { StateLens, Chain, chain } from '../index'

describe('StateLens', () => {
  interface State {
    nested1: {
      nested2: {
        value: number
      }
    }
  }

  class Dummy extends Component<{}, State> {
    lens: Chain<State>

    constructor(props: {}) {
      super(props)
      this.state = {
        nested1: {
          nested2: {
            value: 42
          }
        }
      }

      this.lens = StateLens(this)
    }

    setState(state: Pick<State, keyof State>) {
      this.state = state
    }

    valueLens(): Chain<number> {
      const nested1: Chain<State['nested1']> = chain("nested1")(this.lens)
      const nested2: Chain<State['nested1']['nested2']> = chain("nested2")(nested1)
      const value: Chain<number> = chain("value")(nested2)

      return value
    }

    render() {
      return null
    }
  }

  it("binds lens to the component", () => {
    const component = new Dummy({})
    const lens = component.valueLens()

    expect(lens.view()).toEqual(42)

    lens.set(100)

    expect(component.state).toEqual({
      nested1: {
        nested2: {
          value: 100
        }
      }
    })
  })
})
