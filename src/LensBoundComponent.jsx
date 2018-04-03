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

export default LensBoundComponent
