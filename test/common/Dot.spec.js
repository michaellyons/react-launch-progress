import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Dot from '../../src/common/Dot';


describe('(Component) Dot', () => {
  let _component;

  beforeEach(() => {
    _component = shallow(<Dot r={4} x={20} y={20} />);
  })
  it('Should Exist.', () => {
    expect(_component).to.exist;
  })
  describe('(Props)', () => {
    it('Should have r property (Radius)', () => {
      expect(_component.props().r).to.be.defined;
    })
    it('Should have x property (X Value)', () => {
      expect(_component.props().x).to.be.defined;
    })
    it('Should have y property (Y Value)', () => {
      expect(_component.props().y).to.be.defined;
    })
  })
  it('Should Render a Circle', () => {
    expect(_component.find('circle')).to.have.length(1);
  })
  it('Should Render with Correct Radius', () => {
    expect(_component.find('circle').props().r).to.equal(4);
  })
  it('Should Render with Correct X Value', () => {
    expect(_component.find('circle').props().cx).to.equal(20);
  })
  it('Should Render with Correct Y Value', () => {
    expect(_component.find('circle').props().cy).to.equal(20);
  })
})
