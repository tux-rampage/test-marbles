# RxJS Marbles Testing Helpers

A set of helper functions and matchers for RxJs marble testing in frameworks like Jest and Vitest.
This library will help you to test your reactive code in easy and clear way.

This library was forked from the excellent [jest-marbles](https://github.com/meltedspark/jest-marbles).
Thanks to the original author for the great work!

The difference of this library is, that it will require to wrap your test function with `marbleTest()`. The jest
version uses global beforeEach and afterEach hooks which may cause race conditions in vitest. This library does not
register any global hooks.

# Features
 - Typescript
 - Marblized error messages

# Prerequisites
 - Jest
 - RxJs 7
 - Familiarity with [marbles syntax](https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md)

# Usage

```sh
npm i @tuxrampage/test-marbles@latest -D
```

In the test file:

```js
import {cold, hot, time, schedule} from '@tuxrampage/test-marbles';
```

Inside the test:

```js
import { marbleTest } from '@tuxrampage/test-marbles';

it('should test marbles', marbleTest(() => {
  expect(stream).toBeObservable(expected);
  expect(stream).toBeMarble(marbleString);
  expect(stream).toHaveSubscriptions(marbleString);
  expect(stream).toHaveSubscriptions(marbleStringsArray);
  expect(stream).toHaveNoSubscriptions();
  expect(stream).toSatisfyOnFlush(() => {
    expect(someMock).toHaveBeenCalled();
  })
}));
```

# Examples

## toBeObservable
Verifies that the resulting stream emits certain values at certain time frames
```js
    it('Should merge two hot observables and start emitting from the subscription point', marbleTest(() => {
        const e1 = hot('----a--^--b-------c--|', {a: 0});
        const e2 = hot('  ---d-^--e---------f-----|', {a: 0});
        const expected = cold('---(be)----c-f-----|', {a: 0});

        expect(e1.pipe(merge(e2))).toBeObservable(expected);
    }));
```
Sample output when the test fails (if change the expected result to `'-d--(be)----c-f-----|'`):
```
Expected notifications to be:
  "-d--(be)----c-f-----|"
But got:
  "---(be)----c-f-----|"
```

## toBeMarble
Same as `toBeObservable` but receives marble string instead
```js
    it('Should concatenate two cold observables into single cold observable', marbleTest(() => {
        const a = cold('-a-|');
        const b = cold('-b-|');
        const expected = '-a--b-|';
        expect(a.pipe(concat(b))).toBeMarble(expected);
    }));
```

## toHaveSubscriptions
Verifies that the observable was subscribed in the provided time frames.
Useful, for example, when you want to verify that particular `switchMap` worked as expected:
```js
  it('Should figure out single subscription points', marbleTest(() => {
    const x = cold('        --a---b---c--|');
    const xsubs = '   ------^-------!';
    const y = cold('                ---d--e---f---|');
    const ysubs = '   --------------^-------------!';
    const e1 = hot('  ------x-------y------|', { x, y });
    const expected = cold('--------a---b----d--e---f---|');

    expect(e1.pipe(switchAll())).toBeObservable(expected);
    expect(x).toHaveSubscriptions(xsubs);
    expect(y).toHaveSubscriptions(ysubs);
  }));
```
The matcher can also accept multiple subscription marbles:
```js
  it('Should figure out multiple subscription points', marbleTest(() => {
    const x = cold('                    --a---b---c--|');

    const y = cold('                ----x---x|', {x});
    const ySubscription1 = '        ----^---!';
    //                                     '--a---b---c--|'
    const ySubscription2 = '        --------^------------!';
    const expectedY = cold('        ------a---a---b---c--|');

    const z = cold('                   -x|', {x});
    //                                 '--a---b---c--|'
    const zSubscription = '            -^------------!';
    const expectedZ = cold('           ---a---b---c--|');

    expect(y.pipe(switchAll())).toBeObservable(expectedY);
    expect(z.pipe(switchAll())).toBeObservable(expectedZ);

    expect(x).toHaveSubscriptions([ySubscription1, ySubscription2, zSubscription]);
  }));
```
Sample output when the test fails (if change `ySubscription1` to `'-----------------^---!'`):
```
Expected observable to have the following subscription points:
  ["-----------------^---!", "--------^------------!", "-^------------!"]
But got:
  ["-^------------!", "----^---!", "--------^------------!"]
```

## toHaveNoSubscriptions
Verifies that the observable was not subscribed during the test.
Especially useful when you want to verify that certain chain was not called due to an error:
```js
  it('Should verify that switchMap was not performed due to an error', marbleTest(() => {
    const x = cold('--a---b---c--|');
    const y = cold('---#-x--', {x});
    const result = y.pipe(switchAll());
    expect(result).toBeMarble('---#');
    expect(x).toHaveNoSubscriptions();
  }));
```
Sample output when the test fails (if remove error and change the expected marble to `'------a---b---c--|'`):
```
Expected observable to have no subscription points
But got:
  ["----^------------!"]
```

## toSatisfyOnFlush
Allows you to assert on certain side effects/conditions that should be satisfied when the observable has been flushed (finished)
```js
  it('should verify mock has been called', marbleTest(() => {
      const mock = jest.fn();
      const stream$ = cold('blah|').pipe(tap(mock));
      expect(stream$).toSatisfyOnFlush(() => {
          expect(mock).toHaveBeenCalledTimes(4);
      });
  }));
```

## schedule
Allows you to schedule task on specified frame
```js
  it('should verify subject values', marbleTest(() => {
    const source = new Subject();
    const expected = cold('ab');

    schedule(() => source.next('a'), 1);
    schedule(() => source.next('b'), 2);

    expect(source).toBeObservable(expected);
  }));
```




