import {
    of,
    from,
    fromEvent,
    interval,
    Observable,
    zip,
    throwError,
    EMPTY, Subject,
    NEVER
} from 'rxjs';
import {
    delay,
    mergeMap,
    mergeAll,
    concatMap,
    switchMap,
    map,
    take,
    concatAll,
    switchAll,
    exhaustMap,
    exhaust,
    toArray,
    groupBy,
    tap,
    catchError,
    takeUntil,
    window
} from 'rxjs/operators';

const logger = console;

export function playground() {
    const mapping = value => [value, value ** 2, value ** 3];

    const result = [1, 2, 3]
        .map(v => mapping(v));

    // [[1,1,1],[2,4,8],[3,9,27]]
    // 1, 1, 1, 2, 4, 8, 3, 9, 27
    // 1, 2, 3, 1, 4, 9, 1, 8, 27

    // of(1, 2, 3)
    //     .pipe(
    //         map(value => from(mapping(value)))
    //     )
    //     .subscribe(v => console.log(v, v instanceof Observable));


    // of(1, 2, 3)
    //     .pipe(
    //         map(value => from(mapping(value)))
    //     )
    //     .subscribe(observableValue => {
    //         observableValue
    //             .subscribe(v => console.log(v))
    //     });

    const asyncMapping = value => {
        return interval(100)
            .pipe(
                map(i => value ** (i + 1)),
                take(3)
            )
    };

    // asyncMapping(2)
    //     .subscribe(v => console.log(v))

    // of(1, 2, 3)
    //     .pipe(
    //         map(value => asyncMapping(value))
    //     )
    //     .subscribe(observableValue => {
    //         observableValue
    //             .subscribe(v => console.log(v))
    //     });

    // const subscription = of(1, 2, 3)
    //     .pipe(
    //         map(value => asyncMapping(value))
    //     )
    //     .subscribe(observableValue => {
    //         observableValue
    //             .subscribe(v => console.log(v))
    //     });
    //
    // setTimeout(() => {
    //     subscription.unsubscribe();
    //     console.log('unsubscribe!');
    // }, 150);

    // const subscription = of(1, 2, 3)
    //     .pipe(
    //         map(value => asyncMapping(value)),
    //         mergeAll()
    //     )
    //     .subscribe(value => logger.log(value))
    //
    // setTimeout(() => {
    //     subscription.unsubscribe()
    // }, 150);


    // of(1, 2, 3)
    //     .pipe(
    //         map(v => asyncMapping(v)),
    //         mergeAll()
    //     )
    //     .subscribe(value => logger.log(value))

    // of(1,2,3)
    //     .pipe(
    //         mergeMap(v => asyncMapping(v))
    //     )
    //     .subscribe(value => logger.log(value))

    // of(1,2,3)
    //     .pipe(
    //         mergeMap(
    //             v => asyncMapping(v),
    //             (outerValue, innerValue, outerIndex, innerIndex) => {
    //                 console.log(`${outerValue} → ${innerValue} | ${outerIndex} --- ${innerIndex}`);
    //                 return innerValue;
    //             }
    //         )
    //     )
    //     .subscribe(value => logger.log(value))

    // of(1, 2, 3)
    //     .pipe(
    //         mergeMap(
    //             v => asyncMapping(v)
    //         ),
    //         toArray()
    //     )
    //     .subscribe(value => logger.log(value))
    //
    // of(1, 2, 3)
    //     .pipe(
    //         mergeMap(
    //             v => asyncMapping(v),
    //             2
    //         ),
    //         toArray()
    //     )
    //     .subscribe(value => logger.log(value))


    // of(1, 2, 3)
    //     .pipe(
    //         map(v => asyncMapping(v)),
    //         concatAll()
    //     )
    //     .subscribe(value => logger.log(value))

    // of(1,2,3)
    //     .pipe(
    //         concatMap(v => asyncMapping(v))
    //     )
    //     .subscribe(value => logger.log(value))

    // of(1,2,3)
    //     .pipe(
    //         switchMap(v => asyncMapping(v))
    //     )
    //     .subscribe(value => logger.log(value))

    // interval(250)
    //     .pipe(
    //         take(3),
    //         map(v => asyncMapping(v + 1)),
    //         switchAll()
    //     )
    //     .subscribe(value => logger.log(value))

    // interval(250)
    //     .pipe(
    //         take(3),
    //         switchMap(v => asyncMapping(v + 1))
    //     )
    //     .subscribe(value => logger.log(value))

    // interval(250)
    //     .pipe(
    //         take(3),
    //         exhaustMap(v => asyncMapping(v + 1))
    //     )
    //     .subscribe(value => logger.log(value))

    // что когда использовать
    const request = value => {
        const randomTimeout = 100 + Math.floor(Math.random() * 1000);
        const randomResponse = `${value}_${randomTimeout}`;

        return of(randomResponse).pipe(delay(randomTimeout));
    };
    //
    // request(1)
    //     .subscribe(value => logger.log(value))


    // of(1, 2, 3)
    //     .pipe(
    //         mergeMap(value => request(value))
    //     )
    //     .subscribe(value => logger.log(value))

    // of(1, 2, 3)
    //     .pipe(
    //         concatMap(value => request(value))
    //     )
    //     .subscribe(value => logger.log(value))

    // of(1, 2, 3)
    //     .pipe(
    //         switchMap(value => request(value))
    //     )
    //     .subscribe(value => logger.log(value))

    const requestWithError = value => {
        if (value % 2 === 0) {
            return throwError('💩')
        }

        return request(value);
    };

    // const source = interval(1200).pipe(take(3), map(v => v + 1));
    //
    // source
    //     .pipe(
    //         switchMap(
    //             value => requestWithError(value)
    //         )
    //     )
    //     .subscribe(
    //         v => console.log(v),
    //         err => console.error(err),
    //     );

    // source
    //     .pipe(
    //         switchMap(
    //             value => requestWithError(value)
    //         ),
    //         catchError(error => {
    //             console.log(`catch ${error}`);
    //             return EMPTY;
    //         })
    //     )
    //     .subscribe(
    //         v => console.log(v),
    //         err => console.error(err),
    //     );

    // source
    //     .pipe(
    //         switchMap(
    //             value => requestWithError(value)
    //                 .pipe(
    //                     catchError(error => {
    //                         console.log(`catch ${error}`);
    //                         return EMPTY;
    //                     })
    //                 )
    //         )
    //     )
    //     .subscribe(
    //         v => console.log(v),
    //         err => console.error(err),
    //     );

    // of('двойной_запрос')
    //     .pipe(
    //         switchMap(value => request(value)),
    //         switchMap(anotherValue => request(anotherValue)),
    //     )
    //     .subscribe(
    //         v => console.log(v)
    //     )

    // const destroy$ = new Subject();
    //
    // of(1)
    //     .pipe(
    //         takeUntil(destroy$),
    //         switchMap(value => request(value)),
    //     )
    //     .subscribe({
    //         next: value => console.log(value),
    //         complete: () => console.log('complete')
    //     });
    //
    // console.log('destroy')
    // destroy$.next();

    // const destroy$ = new Subject();
    //
    // of(1)
    //     .pipe(
    //         switchMap(value => request(value)),
    //         takeUntil(destroy$)
    //     )
    //     .subscribe({
    //         next: value => console.log(value),
    //         complete: () => console.log('complete')
    //     });
    //
    // console.log('destroy')
    // destroy$.next();

    // const source$ = interval(1200).pipe(take(3), map(v => v + 1));
    // let flag = true;
    //
    // source$
    //     .pipe(
    //         switchMap(value => {
    //             console.log(`value: ${value}, flag: ${flag}`);
    //             return flag ? request(value) : EMPTY
    //         })
    //     )
    //     .subscribe(v => console.log(v));
    //
    // setTimeout(() => { flag = false; }, 1200);
    // setTimeout(() => { flag = true;  }, 2400);

    // const sourceInterval$ = interval(250).pipe(take(20));
    // const windowInterval$ = interval(1000);
    //
    // sourceInterval$
    //     .pipe(
    //         window(windowInterval$),
    //         map(win => win.pipe(take(2))),
    //         mergeAll()
    //     )
    //     .subscribe(x => console.log(x));

    // const people = [
    //     {name: 'Sue', age: 25},
    //     {name: 'Joe', age: 30},
    //     {name: 'Sarah', age: 35},
    //     {name: 'Frank', age: 25},
    // ];
    //
    // interval(1000).pipe(take(4), map(x => people[x]))
    //     .pipe(
    //         groupBy(person => person.age),
    //         mergeMap(group => group.pipe(map(({name}) => name), toArray()))
    //     )
    //     .subscribe(x => console.log(x));
}


