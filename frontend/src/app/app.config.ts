import {provideHttpClient} from '@angular/common/http';
import {ApplicationConfig} from '@angular/core';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideRouter} from '@angular/router';
import Aura from '@primeuix/themes/aura';
import {providePrimeNG} from 'primeng/config';

import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
    providers : [ provideRouter(routes), provideHttpClient(), provideAnimationsAsync(), providePrimeNG({
                     theme : {
                         preset : Aura
                     }
                 }) ],
};
