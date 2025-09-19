import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'importFieldMapping',
        loadComponent: () => import('./components/mappingfields/mappingfields').then((c) => c.Mappingfields)
    },
    {
        path: '',
        loadComponent: () => import('./components/profilepagelayout/profilepagelayout').then((c) => c.Profilepagelayout)
    },
    {
        path: 'mappingpreview',
        loadComponent: () => import('./components/mappingpreview/mappingpreview').then((c) => c.Mappingpreview)
    },
    {
        path: 'updatedAccountPage',
        loadComponent: () => import('./components/updatedaccountpage/updatedaccountpage').then((c) => c.Updatedaccountpage) 
    }
];
