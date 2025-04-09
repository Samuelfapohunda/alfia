import * as moment from 'moment-timezone';

export class DateUtil {
  private static timeZoneOffset = 1;

  static getCurrentDate(): Date {
    return moment.utc().add(this.timeZoneOffset, 'hours').toDate();
  }

  static getCurrentTime(): string {
    return moment.utc().add(this.timeZoneOffset, 'hours').format('HH:mm:ss A');
  }

  static formatDate(date: Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
    return moment(date)
      .utcOffset(this.timeZoneOffset * 60)
      .format(format);
  }

  static getStartOfDay(): Date {
    return moment
      .utc()
      .add(this.timeZoneOffset, 'hours')
      .startOf('day')
      .toDate();
  }

  static getEndOfDay(): Date {
    return moment.utc().add(this.timeZoneOffset, 'hours').endOf('day').toDate();
  }
}
