const prod = {
    production: true,
    keyName: 'X-API-KEY',
    baseURL: 'https://shitianyu.xyz/api',
    cryptoEndpoint: '/cryptos',
    keyEndpoint: '/keys',
    cmcEndpoint: '/cmcs',
    loginEndpoint: '/login',
};

const dev = {
    production: false,
    keyName: 'X-API-KEY',
    baseURL: 'http://localhost:60001/api',
    cryptoEndpoint: '/cryptos',
    keyEndpoint: '/keys',
    cmcEndpoint: '/cmcs',
    loginEndpoint: '/login',
};

const config = process.env.REACT_APP_STAGE === 'prod' ? prod : dev;

export default config;