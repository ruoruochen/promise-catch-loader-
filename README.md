# promise-catch-loader

this is loader to add catch after promise.then, the arrowFunction will use The Frist Expression of then.

just Like:

```js
// before: 
Promise.resolve('1').then(res => {
    this.loading = false
    this.handleClose()
})

// after
Promise.resolve('1').then(res => {
    this.loading = false
    this.handleClose()
}).catch(()=>{
    this.loading = false
})

```

## How to use

### install

```shell

npm install chenyaya-promise-catch-loader -D
or
yarn add chenyaya-promise-catch-loader --save-d

```

### Set Webpack Config

```js
const path = require('path')

module.exports = {
    entry:'./src/index.js', 
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'./dist')
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:['chenyaya-promise-catch-loader']
            }
        ]
    }
}
```