import Event from 'eventemitter3'

class Timer {
  constructor(opt) {
    this.interval = opt.interval || 18;
    this.index = 0;
    this.maxFrame = 0;
    this.state = 'stop';
    this.event = new Event();

  }
  on(func) {
    this.event.on("tick", function (index) {
      func && func(index);
    })
  };
  run() {
    if(this.state==='running'){
      return setTimeout(() => {
        this.event.emit("tick", this.index);
        this.index++;
        if (this.maxFrame ===0 || this.index < this.maxFrame) {
          this.timeId=this.run();
        }
      }, this.interval);
    }
  };
  start() {
    this.state='running';
    clearTimeout(this.timeId);
    this.timeId=this.run();
  };
  stop(){
    this.index=0;
    this.state='stop';
    clearTimeout(this.timeId);
    this.timeId=null;
  };
  pause(){
    this.state='pause';
    clearTimeout(this.timeId);
    this.timeId=null;
  };
  destroy(){
    this.index=0;
    this.state='stop';
    clearTimeout(this.timeId);
    this.timeId=null;
  }
}
export default Timer;
