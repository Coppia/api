module.exports = {
    mode: {
      debug: true
    },
    server: {
            host: 'localhost',
            port: 7002
    },
    database: {
        host: 'coppia-mysql.c2nenncbrekn.us-west-2.rds.amazonaws.com',
        port: 3306,
        database: 'coppia',
        user: 'coppia_admin',
        password: 'squid2009'
    },
    secret: {
        key: 'a720496337f7bf3e27a6b763e34a7662f1961709daf7e506c590c6ba502bd783'
    },
    key: {
        privateKey: 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc',
        issuer: 'coppia.co',
        tokenExpiry: 1 * 30 * 1000 * 60 //1 hour
    },
    email: {
        username: "",
        password: "",
        accountName: "",
        verifyEmailUrl: ""
    }
};