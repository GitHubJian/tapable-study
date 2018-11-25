const {
    Tapable,
    SyncHook,
    SyncBailHook,
    AsyncParallelHook,
    AsyncSeriesHook
} = require('tapable');
const events = require('events');
const Koa = require('koa');

class Compiler extends Tapable {
    constructor(options) {
        super();
        this.options = options;
        this.app = new Koa();
        this.hooks = {
            plugin: new SyncHook()
        };
        // 整体
        this.emitter = new events.EventEmitter();
        this.emitter.on('plugin', () => {
            let { emitter, eventnames } = this.plugin(options);
            for (const name of eventnames) {
                emitter.emit(name);
            }
            this.hooks.plugin.call();
        });
        this.emitter.on('server', () => {
            this.server();
        });
    }

    plugin(options) {
        let eventnames = ['init', 'emit', 'destory'];
        let emitter = new events.EventEmitter();

        if (options.plugins && Array.isArray(options.plugins)) {
            for (const plugin of options.plugins) {
                let name = plugin.name;
                plugin.apply({
                    plugin: (eventname, callback) => {
                        emitter.on(eventname, () => {
                            this.hooks.plugin.tap(name, () => {
                                callback();
                            });
                        });
                    }
                });
            }
        }

        return { emitter, eventnames };
    }

    run(callback) {
        this.emitter.emit('plugin');
        this.emitter.emit('server');
        callback && callback();
    }

    server() {
        let port = 8416;
        this.app.listen(port, () => {
            console.log(`🌍 Server Started on: http://localhost:${port}`);
        });
    }
}

module.exports = Compiler;
