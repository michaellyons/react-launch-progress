import React from 'react';
import Timeline from '../src/Timeline';
import Chart from '../src/Chart';
import { shallow, render } from 'enzyme';

describe('(Component) Timeline', () => {
  let _component;

  beforeEach(() => {
    _component = shallow(<Timeline xData='date' data={[]} />);
  })
  it('Should exist.', () => {
    expect(_component).to.exist
  })
  it('Should render as a <div>.', () => {
    expect( _component.is('div') ).to.equal(true)
  })
  it('Should have a height property.', () => {
    expect( _component.props().height ).to.be.defined;
  })
  it('Should have a timed property.', () => {
    expect( _component.props().timed ).to.be.defined;
  })
  it('Should have data.', () => {
    expect( _component.props().data ).to.be.defined;
  })
  it('Should find a <Chart />', () => {
    expect( _component.find(Chart) ).to.have.length(1)
  })

})
