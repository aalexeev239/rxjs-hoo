import {
    of,
    from,
    timer,
    interval,
    Observable,
    Subject,
    throwError,
    EMPTY
} from 'rxjs';
import {
    delay,
    mergeMap,
    mergeAll,
    concatMap,
    switchMap,
    map,
    take,
    exhaustMap,
    toArray,
    groupBy,
    tap,
    catchError,
    takeUntil,
    window as _window
} from 'rxjs/operators';

export function codeInit() {
    const mapping = value => [value, value ** 2, value ** 3];
    const asyncMapping = value => {
        return interval(100)
            .pipe(
                map(i => value ** (i + 1)),
                take(3)
            )
    };
    const request = value => {
        const randomTimeout = 100 + Math.floor(Math.random() * 1000);
        const randomResponse = `${value}_${randomTimeout}`;

        return of(randomResponse).pipe(delay(randomTimeout));
    };

    const requestWithError = value => {
        if (value % 2 === 0) {
            return throwError('💩')
        }

        return request(value);
    };

    const source$ = interval(1200).pipe(
        take(3),
        map(v => v + 1)
    );

    function subInSub() {
        of(1, 2, 3)
            .pipe(
                map(value => from(mapping(value)))
            )
            .subscribe(observable$ => {
                observable$
                    .subscribe(value => logger.log(value))
            });
    }

    function asyncMappingExample() {
        asyncMapping(2)
            .subscribe(value => logger.log(value));
    }

    function subInSubAsync() {
        of(1, 2, 3)
            .pipe(
                map(value => asyncMapping(value))
            )
            .subscribe(observable$ => {
                observable$
                    .subscribe(value => logger.log(value))
            });
    }

    function subInSubUnsub() {
        const subscription = of(1, 2, 3)
            .pipe(
                map(value => asyncMapping(value))
            )
            .subscribe(observable$ => {
                observable$
                    .subscribe(value => logger.log(value))
            });

        setTimeout(() => {
            subscription.unsubscribe();
            logger.log('unsubscribe!');
        }, 150);
    }

    function mergeAllExample() {
        const subscription = of(1, 2, 3)
            .pipe(
                map(value => asyncMapping(value)),
                mergeAll()
            )
            .subscribe(value => logger.log(value));

        setTimeout(() => {
            subscription.unsubscribe();
            logger.log('unsubscribe!');
        }, 150);
    }

    function mergeMapExample() {
        const subscription = of(1, 2, 3)
            .pipe(
                mergeMap(value => asyncMapping(value))
            )
            .subscribe(value => logger.log(value));

        setTimeout(() => {
            subscription.unsubscribe();
            logger.log('unsubscribe!');
        }, 150);
    }

    function operatorMergeMap() {
        const playgroundElement = document.getElementById('operatorMergeMap');
        playgroundElement.innerHTML = '';
        const streamA$ = timer(0, 1500)
            .pipe(
                take(3),
                map((value) => 'abc'[value])
            );
        const streamB$ = streamA$
            .pipe(
                mergeMap(value => {
                    return timer(0, 450)
                        .pipe(
                            take(6),
                            map(innerValue => value + innerValue)
                        );
                })
            );
        timeline.startStream(playgroundElement, streamA$);
        timeline.startStream(playgroundElement, streamB$);
    }

    function mergeMapSelector() {
        of(1,2,3)
            .pipe(
                mergeMap(
                    v => asyncMapping(v),
                    (outValue, inValue, outIndex, inIndex) => {
                        logger.log(`${outValue} → ${inValue} | ${outIndex} --- ${inIndex}`);
                        return inValue;
                    }
                )
            )
            .subscribe(value => logger.log(value));
    }

    function mergeMapCounter1() {
        of(1, 2, 3)
            .pipe(
                mergeMap(
                    value => asyncMapping(value)
                ),
                toArray()
            )
            .subscribe(value => logger.log(value));
    }

    function mergeMapCounter2() {
        mergeMapCounter1();

        setTimeout(() => {
            of(1, 2, 3)
                .pipe(
                    mergeMap(
                        value => asyncMapping(value),
                        2
                    ),
                    toArray()
                )
                .subscribe(value => logger.log(value));
        }, 100)
    }

    function mergeMapCounter3() {
        of(1, 2, 3)
            .pipe(
                mergeMap(
                    value => asyncMapping(value),
                    1
                ),
                toArray()
            )
            .subscribe(value => logger.log(value));
    }

    function concatMapExample() {
        of(1,2,3)
        .pipe(
            concatMap(value => asyncMapping(value))
        )
        .subscribe(value => logger.log(value));
    }

    function switchMapExample() {
        of(1,2,3)
            .pipe(
                switchMap(value => asyncMapping(value))
            )
            .subscribe(value => logger.log(value));
    }

    function operatorSwitchMap() {
        const playgroundElement = document.getElementById('operatorSwitchMap');
        playgroundElement.innerHTML = '';
        const streamA$ = timer(0, 1500)
            .pipe(
                take(3),
                map((value) => 'abc'[value])
            );
        const streamB$ = streamA$
            .pipe(
                switchMap(value => {
                    return timer(0, 450)
                        .pipe(
                            take(6),
                            map(innerValue => value + innerValue)
                        );
                })
            );
        timeline.startStream(playgroundElement, streamA$);
        timeline.startStream(playgroundElement, streamB$);
    }

    function exhaustMapExample() {
        of(1,2,3)
            .pipe(
                exhaustMap(value => asyncMapping(value))
            )
            .subscribe(value => logger.log(value));
    }

    function fakeRequest() {
        request(1)
            .subscribe(value => logger.log(value));
    }

    function mergeMapRequest() {
        of(1, 2, 3)
            .pipe(
                mergeMap(value => request(value))
            )
            .subscribe(value => logger.log(value));
    }

    function concatMapRequest() {
        of(1, 2, 3)
            .pipe(
                concatMap(value => request(value))
            )
            .subscribe(value => logger.log(value));
    }

    function switchMapRequest() {
        of(1, 2, 3)
            .pipe(
                switchMap(value => request(value))
            )
            .subscribe(value => logger.log(value));
    }

    function exhaustMapRequest() {
        of(1, 2, 3)
            .pipe(
                exhaustMap(value => request(value))
            )
            .subscribe(value => logger.log(value));
    }

    function errorRecipe1() {
        source$
            .pipe(
                switchMap(value => requestWithError(value))
            )
            .subscribe(
                value => logger.log(value),
                error => logger.log(error)
            );
    }

    function errorRecipe2() {
        source$
            .pipe(
                switchMap(value => requestWithError(value)),
                catchError(error => {
                    logger.log(`catch ${error}`);
                    return EMPTY;
                })
            )
            .subscribe(
                value => logger.log(value),
                error => logger.log(error)
            );
    }

    function errorRecipe3() {
        source$
            .pipe(
                switchMap(value => {
                    return requestWithError(value)
                        .pipe(catchError(error => {
                            logger.log(`catch ${error}`);
                            return EMPTY;
                        }));
                })
            )
            .subscribe(
                value => logger.log(value),
                error => logger.log(error)
            );
    }

    function chainRequestRecipe() {
        of('цепочка')
            .pipe(
                switchMap(value => request(value)),
                switchMap(anotherValue => request(anotherValue)),
            )
            .subscribe(value => logger.log(value),);
    }

    function destroyRecipe1() {
        const destroy$ = new Subject();

        of(1)
            .pipe(
                takeUntil(destroy$),
                switchMap(value => request(value))
            )
            .subscribe({
                next: value => logger.log(value),
                complete: () => logger.log('complete')
            });

        logger.log('destroy');
        destroy$.next();
    }

    function destroyRecipe2() {
        const destroy$ = new Subject();

        of(1)
            .pipe(
                switchMap(value => request(value)),
                takeUntil(destroy$)
            )
            .subscribe({
                next: value => logger.log(value),
                complete: () => logger.log('complete')
            });

        logger.log('destroy');
        destroy$.next();
    }

    function iffyRecipe() {
        const source$ = interval(1200).pipe(take(3), map(v => v + 1));
        let flag = true;

        source$
            .pipe(
                switchMap(value => {
                    logger.log(`value: ${value}, flag: ${flag}`);
                    return flag ? request(value) : EMPTY
                })
            )
            .subscribe(v => logger.log(v));

        setTimeout(() => { flag = false; }, 1200);
        setTimeout(() => { flag = true;  }, 2400);
    }

    function windowOperator() {
        const sourceInterval$ = interval(250).pipe(take(20));
        const windowInterval$ = interval(1000);

        sourceInterval$
            .pipe(
                _window(windowInterval$),
                map(win => win.pipe(take(2))),
                mergeAll()
            )
            .subscribe(x => logger.log(x));
    }

    function groupByOperator() {
        const people = [
            {name: 'Sue', age: 25},
            {name: 'Joe', age: 30},
            {name: 'Sarah', age: 35},
            {name: 'Frank', age: 25},
        ];

        interval(1000).pipe(take(4), map(x => people[x]))
            .pipe(
                groupBy(person => person.age),
                mergeMap(group => group.pipe(map(({name}) => name), toArray()))
            )
            .subscribe(x => logger.log(x));
    }

    window.code = {
        subInSub,
        asyncMappingExample,
        subInSubAsync,
        subInSubUnsub,
        mergeAllExample,
        mergeMapExample,
        operatorMergeMap,
        mergeMapSelector,
        mergeMapCounter1,
        mergeMapCounter2,
        mergeMapCounter3,
        concatMapExample,
        switchMapExample,
        operatorSwitchMap,
        exhaustMapExample,
        fakeRequest,
        mergeMapRequest,
        concatMapRequest,
        switchMapRequest,
        exhaustMapRequest,
        chainRequestRecipe,
        errorRecipe1,
        errorRecipe2,
        errorRecipe3,
        destroyRecipe1,
        destroyRecipe2,
        iffyRecipe,
        windowOperator,
        groupByOperator
    };
}
