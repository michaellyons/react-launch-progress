import React from 'react';
import { mount, shallow, render } from 'enzyme';
import AnimatedProgress from '../../src/common/AnimatedProgress';


describe('(Component) Progress', () => {
  let _component;

  beforeEach(() => {
    _component = shallow(<AnimatedProgress />);
  })
  it('Should Exist.', () => {
    expect(_component).to.exist;
  })
})
