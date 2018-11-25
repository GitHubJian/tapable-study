const Compiler = require('./compiler');

class Myplugin {
    constructor() {
        this.name = 'myplugin';
    }
    apply(compiler) {
        compiler.plugin('init', () => {
            console.log(1);
        });
        compiler.plugin('emit', () => {
            console.log(2);
        });
        compiler.plugin('destory', () => {
            console.log(3);
        });
    }
}
let p1 = new Myplugin(),
    p2 = new Myplugin();

let compiler = new Compiler({ plugins: [p1, p2] });

compiler.run(() => {
    console.log('Complete');
});
