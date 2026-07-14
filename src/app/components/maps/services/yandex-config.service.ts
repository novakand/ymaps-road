// src/app/services/yandex-config.service.ts

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface YandexConfig {
    mapsApiKey: string;
    suggestApiKey: string;
    geocoderApiKey: string;
    apiBaseUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class YandexConfigService {

    private config: YandexConfig = {
        mapsApiKey: '042405c2-12f5-4b78-9580-cb5ea1d7c106',
        suggestApiKey: '23b76e0e-63d3-48f0-a3b5-e607d7c078e9',
        geocoderApiKey: '86b21bb6-3702-4519-bd25-93f8cfa92b78',
        apiBaseUrl: environment.apiBaseUrl
    };

    public setConfig(config: Partial<YandexConfig>): void {
        this.config = {
            ...this.config,
            ...config
        };
    }

    public get value(): YandexConfig {
        return this.config;
    }
}