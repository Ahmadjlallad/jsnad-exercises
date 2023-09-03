const dns = require("node:dns/promises");

const dd = console.log;

(async () => {
    dd((await dns.lookup('twitter.com', 4)));
    dd(dns.getServers())
    dd((await dns.resolve('twitter.com')))
    dd((await dns.lookupService('127.0.0.1', 3306)))
})()
