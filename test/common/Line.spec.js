import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Line from '../../src/common/Line';


describe('(Component) Line', () => {
  let _component;

  beforeEach(() => {
    _component = shallow(<Line r={4} x={20} y={20} />);
  })
  it('Should Exist.', () => {
    expect(_component).to.exist;
  })
  describe('(Props)', () => {
    it('Should have path property (SVG Path)', () => {
      expect(_component.props().path).to.be.defined;
    })
    it('Should have stroke property (Color)', () => {
      expect(_component.props().stroke).to.be.defined;
    })
    it('Should have strokeWidth property (Line Width)', () => {
      expect(_component.props().strokeWidth).to.be.defined;
    })
  })

})
