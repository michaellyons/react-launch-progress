import React from 'react';
import { mount, shallow, render } from 'enzyme';
import Progress from '../../src/common/Progress';


describe('(Component) Progress', () => {
  let _component;

  beforeEach(() => {
    _component = shallow(<Progress />);
  })
  it('Should Exist.', () => {
    expect(_component).to.exist;
  })
})
