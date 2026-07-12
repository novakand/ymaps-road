import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, Observable, of, Subscription } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';


export class Geocoder {
    options: any;
    // URL для обычного (адресного) геокодирования
    api: string;
    // URL для реверс‑геокодирования (по координатам)
    apiReverse: string;
    private http: HttpClient;
    private selectedResult: any = null;
    private _results: any[] = [];

    // Потоки для уведомлений о событиях
    loading$: Subject<void> = new Subject();
    results$: Subject<any[]> = new Subject();
    result$: Subject<any> = new Subject();
    error$: Subject<any> = new Subject();
    clear$: Subject<void> = new Subject();

    // Ссылка на текущую подписку на запрос геокодирования
    private currentRequestSubscription: Subscription | null = null;

    constructor(options: any, http: HttpClient) {
        this.options = options || {};
        // Если запрос реверс (options.isReverse === true) – используем другой URL
        // В нашем случае: если передана строка (isReverse не выставлен или false), используем getDetails,
        // иначе (если options.isReverse === true) – используем геокодирование по координатам.
        this.api = this.options.isReverse ? `${environment.apiUri}v1/geocode` : `${environment.apiUri}v1/getDetails`;
        this.http = http;
    }

    /**
     * Выполняет запрос геокодирования или реверс‑геокодирования.
     * @param query — строка запроса (если обычное геокодирование) или строка координат (например, "lat,lng") для реверса.
     * @param isReverse — true, если выполняется реверс‑геокодирование.
     * @returns Observable, выдающий массив результатов.
     */
    private geocode(query: string, isReverse: boolean): Observable<any[]> {
        this.loading$.next();
        const paramsObj: any = {};
        // В зависимости от типа запроса формируем параметры.
        if (isReverse) {
            // Если запрос по координатам – передаём их как параметр (например, latlng)
            paramsObj.latlng = query;
        } else {
            // Если строка – адрес, передаём его как placeId (или другой параметр)
            paramsObj.placeId = query;
        }
        paramsObj.language = 'ru';
        const exclude = ['placeholder', 'zoom', 'flyTo', 'accessToken', 'api', 'apiReverse', 'isReverse'];
        Object.keys(this.options || {}).forEach(key => {
            if (exclude.indexOf(key) === -1) {
                paramsObj[key] = this.options[key];
            }
        });
        const accessToken = this.options.accessToken;
        paramsObj['access_token'] = accessToken;
        const params = new HttpParams({ fromObject: paramsObj });
        const url = this.api;
        return this.http.get<any>(url, { params }).pipe(
            switchMap((data: any) => {
                if (data) {
                    this._results = data;
                    this.results$.next(data);
                    return of(data);
                }
                return of([]);
            }),
            finalize(() => {
                // Здесь можно завершить loading, если нужно
            })
        );
    }

    /**
     * Выполняет запрос геокодирования.
     * Если query – строка, используется обычный поиск по адресу;
     * если query – массив (например, [lng, lat]), выполняется реверс‑геокодирование.
     * При каждом новом вызове предыдущий запрос отменяется.
     */
    public query(query: string | any[]): void {
        let isReverse = false;
        let q: string;
        if (Array.isArray(query)) {
            // Если переданы координаты, устанавливаем флаг реверс‑геокодирования
            isReverse = true;
            // Формируем строку в формате "lat,lng" (согласно вашему требованию)
            q = `${query[1]},${query[0]}`;
        } else {
            q = query;
        }

        // Если существует активная подписка, отменяем предыдущий запрос
        if (this.currentRequestSubscription) {
            this.currentRequestSubscription.unsubscribe();
        }
        this.currentRequestSubscription = this.geocode(q, isReverse).subscribe({
            next: data => {
                if (data) {
                    this.selectedResult = data;
                    this.result$.next(this.selectedResult);
                }
            },
            error: error => {
                this.error$.next(error);
            }
        });
    }

    setInput(value: string | any[]): this {
        this.selectedResult = null;
        this._results = [];
        return this;
    }

    clear(): this {
        this.selectedResult = null;
        this._results = [];
        this.clear$.next();
        return this;
    }

    getResult(): any {
        return this.selectedResult;
    }
}

