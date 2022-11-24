'use strict'
const path = require('path')


const FileManagerPlugin = require("filemanager-webpack-plugin")

// 代码打包之后取出console.log压缩代码
const TerserPlugin = require("terser-webpack-plugin");

// gzip压缩，打包到pad时，需要将gzip注释
const CompressionPlugin = require("compression-webpack-plugin");


function resolve(dir) {
    return path.join(__dirname, dir)
}


// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9529 // dev port


module.exports = {
    // publicPath: './', // pad打包打开，pc打包注释
    publicPath: process.env.VUE_APP_RUNTIME_ENV === "pc" ? "/teacher" : "./", // pc打包打开，pad打包注释
    outputDir: 'dist',
    assetsDir: 'teacher',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },

        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                target: process.env.VUE_APP_BASE_API,
                // target: "http://10.255.23.231:8080/",
                changeOrigin: true,  // 配置跨域
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
        },
    },

    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        plugins: [
            new FileManagerPlugin({
                events: {
                    onEnd: {
                        mkdir: ['./dist'], // 新加的一句代码
                        delete: [
                            './dist/dist.zip',
                        ],
                        archive: [
                            { source: './dist', destination: './dist/dist.zip' },
                        ]
                    }
                }
            })
        ]
    },

    // configureWebpack: config => {
    //     const targetConfig = {
    //         resolve: {
    //             alias: {
    //                 '@': resolve('src')
    //             }
    //         },
    //         plugins: []
    //     }
    //     if (process.env.NODE_ENV === 'nx') {
    //         targetConfig.plugins.push(new FileManagerPlugin({
    //             events: {
    //                 onEnd: {
    //                     mkdir: ['./dist'], // 新加的一句代码
    //                     delete: [
    //                         './dist/dist.zip',
    //                     ],
    //                     archive: [
    //                         { source: './dist', destination: './dist/dist.zip' },
    //                     ]
    //                 }
    //             }
    //         }))
    //     }
    // },

    chainWebpack(config) {
        // new 1
        config.plugin('preload').tap(() => [
            {
                rel: 'preload',
                fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
                include: 'initial'
            }
        ])
        // 移除prefetch插件，避免加载多余的资源
        config.plugins.delete('prefetch')

        // 压缩代码
        // config.optimization.minimize(true)
        // // 分割代码
        // config.optimization.splitChunks({
        //     chunks: 'all'
        // })
        // ---------------

        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
        config
            .plugin('html')
            .tap(args => {
                args[0].title = '水獭教师端'
                return args
            })

    },

    // webpack的配置  new2
    // configureWebpack: config => {
    //     // 生产环境配置
    //     if (process.env.NODE_ENV !== 'development') {
    //         // 代码压缩去除console.log
    //         config.plugins.push(
    //             new TerserPlugin({
    //                 terserOptions: {
    //                     ecma: undefined,
    //                     warnings: false,
    //                     parse: {},
    //                     compress: {
    //                         drop_console: true,
    //                         drop_debugger: true,
    //                         pure_funcs: ['console.log'] // 移除console
    //                     }
    //                 }
    //             }),
    //             // 打包到pad时，需要将gzip注释
    //             new CompressionPlugin({
    //                 test: /\.js$|\.html$|\.css/, // 匹配文件名
    //                 threshold: 10240, // 对超过10k的文件进行压缩
    //                 deleteOriginalAssets: true, // 是否删除原文件
    //             })
    //         )
    //     }
    // }


    // ---------------------
}