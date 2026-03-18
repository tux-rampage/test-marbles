import { map } from 'rxjs/operators';
import { timer } from 'rxjs';

import { hot, marbleTest, Scheduler, time } from '../index';

describe('rxjs timers', () => {
  it(
    'Should delay the emission by provided timeout with provided scheduler',
    marbleTest(() => {
      const delay = time('-----d|');
      const provided = timer(delay, Scheduler.get()).pipe(map(() => 0));

      const expected = hot('------(d|)', { d: 0 });

      expect(provided).toBeObservable(expected);
    })
  );

  it(
    'Should ignore whitespace to allow vertical alignment',
    marbleTest(() => {
      const referenceDelay = time('-----d|');
      const alignedDelay = time('  -----d|');

      expect(alignedDelay).toBe(referenceDelay);
    })
  );
});
