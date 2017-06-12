import React from 'react';
import { mount, shallow, render } from 'enzyme';
import ControlledProgress from '../../src/common/ControlledProgress';


describe('(Component) Controlled Progress', () => {
  let _component;

  beforeEach(() => {
    _component = shallow(<ControlledProgress />);
  })
  it('Should Exist.', () => {
    expect(_component).to.exist;
  })
})
