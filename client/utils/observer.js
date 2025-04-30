export class ʤ {
  constructor(observationList) {
    this.observers = {};
    observationList.forEach((channel) => {
      this.observers[channel] = [];
    });
  }
  addObserver(channel, callback) {
    this.observers[channel].push(callback);
  }
  removeObserver(channel, callback) {
    let index = this.observers.indexOf(channel);
    if (index >= 0) {
      this.observers.splice(index, 1);
    }
  }
  notify(channel, notification) {
    console.log(`notifying ::: ${channel} <<< ${notification}`);
    this.observers[channel].forEach((callback) => callback(notification));
  }
}
