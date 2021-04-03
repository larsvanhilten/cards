import { Router } from '@angular/router';
import { SocketService } from 'src/app/shared/services/socket/socket.service';
import { createSpyObj } from '../../utils/create-spy-obj';
import { UsernameComponent } from './username.component';

import Mocked = jest.Mocked;

describe('UsernameComponent', () => {
  let component: UsernameComponent;

  let routerSpy: Mocked<Router>;
  let socketServiceSpy: Mocked<SocketService>;
  beforeEach(() => {
    routerSpy = createSpyObj('Router', ['navigate']);
    socketServiceSpy = createSpyObj('SocketService', ['start']);

    component = new UsernameComponent(routerSpy, socketServiceSpy);
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
