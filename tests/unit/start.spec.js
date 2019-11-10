import React from 'react'
import App from '../../src/App'
import renderer from 'react-test-renderer'

describe('App component', () => {
  it('Mounts without error', () => {
    const component = renderer.create(<App />)
    expect(component).toBeTruthy()
    expect(component).toMatchSnapshot()
  })
})
