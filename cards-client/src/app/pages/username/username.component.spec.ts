import { Router } from '@angular/router';
import { createSpyObj } from '../../utils/create-spy-obj';
import { UsernameComponent } from './username.component';

import Mocked = jest.Mocked;

describe('UsernameComponent', () => {
  let component: UsernameComponent;

  let routerSpy: Mocked<Router>;
  beforeEach(() => {
    routerSpy = createSpyObj('Router', ['navigate']);

    component = new UsernameComponent(routerSpy);
  });

  it('should navigate with a valid username', () => {
    component.continue('bob');

    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should not navigate with a username with just spaces', () => {
    component.continue('   ');

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
