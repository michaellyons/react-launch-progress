import React from 'react';
import Timeline from '../src/Timeline';
import Chart from '../src/Chart';
import { mount, shallow, render } from 'enzyme';
import test_dates from './test_dates';
describe('(Component) Chart', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Chart height={100} title="test-chart" showDots={true} showGoal={true} data={test_dates} />);
  })
  it('Should exist.', () => {
    expect(wrapper).to.exist
  })
  describe('(General)', () => {
    it('Should render nothing without Data', () => {
      let failWrap = shallow(<Chart data={[]} />);
      expect( failWrap.type() ).to.equal(null)
    })
    it('Renders correct title', () => {
      expect(wrapper.find('#chart_title').text()).to.equal('test-chart')
    })
    it('Should find an SVG child', () => {
      expect( wrapper.find('#event-timeline') ).to.have.length(1)
    })
  })

  describe('(Props)', () => {
    it('Should have a height property.', () => {
      expect( wrapper.props().height ).to.be.defined;
    })
  })
  describe('(Dots)', () => {
    it ('Renders Dots When showDots is True', () => {
      // There will be TestDates + 1 dots because of Goal Dot
      expect( wrapper.find('#dots').children() ).to.have.length(test_dates.length + 1);
    })
  })
  describe('(Goal)', () => {
    it('Renders Goal Label When showGoal is True', () => {
      expect(wrapper.find('#goal_label').text()).to.exist
    })
    it('Renders Goal Dot When showGoal is True', () => {
      expect(wrapper.find('#goal_dot')).to.have.length(1)
    })
    it('Doesn\'t Goal Text When showGoal is False', () => {
      let wrapper = shallow(<Chart height={100} title="test-chart" showGoal={false} data={test_dates} />);
      expect(wrapper.find('#goal_label')).to.have.length(0)
    })
    it('Doesn\'t Goal Dot When showGoal is False', () => {
      let wrapper = shallow(<Chart height={100} title="test-chart" showGoal={false} data={test_dates} />);
      expect(wrapper.find('#goal_dot')).to.have.length(0)
    })
  })

})
