import { BrowserRequest } from './browser-request';
import { UserInteraction } from './user-interaction';

export class Redirect extends UserInteraction {
    request: BrowserRequest;
}
