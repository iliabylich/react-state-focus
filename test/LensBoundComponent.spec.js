import React from 'react'
import TestRenderer from 'react-test-renderer'
import ReactDOM from 'react-dom'
// import ReactTestUtils from 'react-dom/test-utils'
import LensBoundComponent from '../src/LensBoundComponent'
import StateBoundLens from '../src/StateBoundLens'

describe('LensBoundComponent', () => {
  let events, lens

  beforeEach(() => {
    events = []
  })

  const Counter = ({ lens }) => {
    events.push(0)

    return (
      <div>
        {lens.view()}
      </div>
    )
  }
  const LensCounter = LensBoundComponent(Counter)

  class Form extends React.Component {
    constructor(props, context) {
      super(props, context)
      this.state = { counter: 0 }
      lens = this.lens = new StateBoundLens(this, 'counter')
    }

    render() {
      return <LensCounter lens={this.lens} />
    }
  }

  const render = () => {
    const div = document.createElement('div')
    ReactDOM.render(<Form />, div)
  }

  it('still renders a component', () => {
    expect(events).toHaveLength(0)

    render()

    expect(events).toHaveLength(1)
  })

  it('prevents re-rendering when lens returns the same value', () => {
    render()

    expect(events).toHaveLength(1)
    lens.set(0)
    expect(events).toHaveLength(1)
  })

  it('does re-rendering when lens returns a new value', () => {
    render()

    expect(events).toHaveLength(1)
    lens.set(1)
    expect(events).toHaveLength(2)
  })
})
