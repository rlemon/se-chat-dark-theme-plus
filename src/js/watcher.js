class Watcher {
    constructor(container) {
        this.parsers = [];
        this.watchers = [];
        this.queue = [];
        this.container = container;
        this.observer = new MutationObserver(record => this.defaultParser(record)).observe(container, {
            childList: true,
            subtree: true
        });
    }
    defaultParser(records) {
        records.forEach(record => this.force(record.addedNodes, record.removedNodes));
    }
    addParser(parser, selector) { // parsers parse new nodes
        this.parsers.push(parser);
        if( selector ) {
            this.queue.push(selector);
        }
    }
    addWatcher(watcher) { // watchers watch for node removal. 
        this.watchers.push(watcher);
    }
    removeWatcher(watcher) {
        this.watchers = this.watchers.filter(_watcher => _watcher !== watcher );
    }
    drain () {
        this.queue.forEach(selector => this.force(document.querySelectorAll(selector),[]));
        this.queue = [];
    }
    force(added, removed) {
        [...added].forEach(node => node.classList && (this.parsers.forEach(parser => parser(node))));
        [...removed].forEach(node => this.watchers.forEach(watcher => watcher(node)));
    }
}
let watcher = new Watcher(document.body);