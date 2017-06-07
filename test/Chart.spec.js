import React from 'react';
import Chart from '../src/Chart';
import { mount, shallow, render } from 'enzyme';
import test_dates from './test_dates';
let dates = test_dates(true);
describe('(Component) Chart', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Chart height={100} xData={'date'} title="test-chart" showDots={true} data={dates} />);
  });
  it('Should exist.', () => {
    expect(wrapper).to.exist
  });

  describe('(General)', () => {
    it('Should render nothing without Data', () => {
      let failWrap = shallow(<Chart data={[]} />);
      expect( failWrap.type() ).to.equal(null)
    });
    it('Renders correct title', () => {
      expect( wrapper.find('#chart_title').text() ).to.equal('test-chart')
    });
    it('Should find an SVG child', () => {
      expect( wrapper.find('#event-timeline') ).to.have.length(1);
    });
    it('Should render with correct height', () => {
      expect( wrapper.find('#event-timeline').props().height ).to.equal(100);
    });
  });
  describe('(Dots)', () => {
    it ('Renders Dot Wrapper Always', () => {
      // There will always be a #dots
      expect( wrapper.find('#dots') ).to.have.length(1);
    });

    it ('Renders Correct Amount of Dots', () => {
      // There will be TestDates + 1 dots because of Goal Dot
      expect( wrapper.find('#dots').children() ).to.have.length(dates.length);
    });

  });
  describe('(Goal)', () => {
    it('Renders Goal Label', () => {
      expect( wrapper.find('#goal_label') ).to.exist;
    });
  });

});
