import { TimeStampToTimePipe } from './Time-stamp-to-time.pipe';

describe('TimeStampToTimePipe', () => {
  it('create an instance', () => {
    const pipe = new TimeStampToTimePipe();
    expect(pipe).toBeTruthy();
  });
});
