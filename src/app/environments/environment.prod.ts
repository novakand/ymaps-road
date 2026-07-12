import { IEnvironment } from "./interfaces/environment.interface";

export const environment: IEnvironment = {
    debounceTime: 300,
    production: true,
    ssoUri: '',
    apiUri: '/wp-json/routegis/v1',
    apiUriMapbox: '',
    accessTokenMapBox: ''
}
