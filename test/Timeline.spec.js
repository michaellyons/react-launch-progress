import React from 'react';
import Timeline from '../src/Timeline';
import Chart from '../src/Chart';
import { shallow, render } from 'enzyme';
import PropTypes from 'prop-types';
import test_dates from './test_dates';

describe('(Component) Timeline', () => {
  let _component;

  beforeEach(() => {
    _component = shallow(<Timeline height={100} xData='date' data={test_dates} />);
  })

  it('Should exist.', () => {
    expect(_component).to.exist
  })
  it('Should render as a <div>.', () => {
    expect( _component.is('div') ).to.equal(true)
  })
  it('Should find a <Chart />', () => {
    expect( _component.find(Chart) ).to.have.length(1)
  })

  describe('(Props)', () => {
    it('Should have a height property.', () => {
      expect( _component.props().height ).to.be.defined;
    })
    it('Should have a timed property.', () => {
      expect( _component.props().timed ).to.be.defined;
    })
    it('Should have a title property.', () => {
      expect( _component.props().title ).to.be.defined;
    })
    it('Should have an xData property.', () => {
      expect( _component.props().xData ).to.be.defined;
    })
    it('Should have a data property.', () => {
      expect( _component.props().data ).to.be.defined;
    })
  })


})
