import { cold, marbleTest } from '../index';
import { tap } from 'rxjs/operators';

describe('toSatisfyOnFlush', () => {
  it(
    'should verify mock has been called',
    marbleTest(() => {
      const mock = vi.fn();
      const stream$ = cold('blah|').pipe(tap(mock));
      expect(stream$).toSatisfyOnFlush(() => {
        expect(mock).toHaveBeenCalledTimes(4);
      });
    })
  );
});
