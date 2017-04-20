import React from 'react';
import Timeline from '../src/Timeline';
import Chart from '../src/Chart';
import { shallow, render } from 'enzyme';

describe('(Component) Chart', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Chart data={[]} />);
  })
  it('Should exist.', () => {
    expect(wrapper).to.exist
  })
  it('Should render nothing without Data', () => {
    let failWrap = shallow(<Chart />);
    expect( failWrap.type() ).to.equal(null)
  })
  it('Should render as a <div> with Data.', () => {
    expect( wrapper.is('div') ).to.equal(true)
  })
  it('Should have a height property.', () => {
    expect( wrapper.props().height ).to.be.defined;
  })
  it('Should find an SVG', () => {
    expect( wrapper.find('#event-timeline') ).to.have.length(1)
  })

})
