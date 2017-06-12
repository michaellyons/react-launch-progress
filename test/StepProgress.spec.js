import React from 'react';
import StepProgress from '../src/StepProgress';
import Chart from '../src/Chart';
import { mount, shallow, render } from 'enzyme';
import PropTypes from 'prop-types';
import test_dates from './test_dates';
let dates = test_dates();

describe('(Component) StepProgress', () => {
  let _component;

  beforeEach(() => {
    _component = shallow(<StepProgress height={100} utc={true} xData='date' data={dates} />);
  })

  it('Should exist.', () => {
    expect(_component).to.exist
  })
  it('Should find a <Chart />', () => {
    expect( _component.find(Chart) ).to.have.length(1)
  })
  describe('(Progress)', () => {
    it('Has a Progress Child', () => {
      expect( _component.find('#chart_progress') ).to.have.length(1);
    });
  });
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
