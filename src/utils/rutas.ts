import {environment as env} from '../environments/environment';

export const WS_URL_OPERACIONES = `${env.url}:${env.operacionesPort}/`;
export const WS_URL_CARGUE = `${env.url}:${env.carguePort}/`;
export const WS_URL_LOGIN = `${env.url}:${env.autenticacionPort}/`;

export const WS_URL_NOVEDADES = `${env.url}:${env.novedadesPort}/`;
