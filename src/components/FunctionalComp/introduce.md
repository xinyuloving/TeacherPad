# TButton

**button按钮，内容以slot的形式传入**

## 属性

|       属性名        |                         含义                          |  类型   | 必填  |       可选值        | 默认值  |
| :-----------------: | :---------------------------------------------------: | :-----: | :---: | :-----------------: | :-----: |
|      disabled       |                       是否禁用                        | Boolean |  否   |     true/false      |  false  |
|        type         |                       按钮类型                        | String  |  否   | text/normal/primary | primary |
|      btnStyle       |                   设置按钮内联样式                    | Object  |  否   |          -          |   无    |
| createDomForContent |              为按钮内容创建span元素包裹               | Boolean |  否   |     true/false      |  false  |
|       loading       | 为按钮添加loading效果，为true时同时也无法响应点击事件 | Boolean |  否   |     true/false      |  false  |
|    loadingClass     |              为按钮的loading元素添加类名              | String  |  否   |          -          |   无    |


## 事件

| 事件名 |      含义      | 事件参数 | 参数类型 |
| :----: | :------------: | :------: | :------: |
| click  |  pc端点击事件  | 事件对象 |  Object  |
| touch  | 移动端点击事件 | 事件对象 |  Object  |



# TDialog

## 属性

|      属性名       |                                                                             含义                                                                              |      类型      | 必填  |   可选值   | 默认值 |
| :---------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------: | :---: | :--------: | :----: |
|      visible      |                                                              是否显示 TDialog，支持 .sync 修饰符                                                              |    Boolean     |  是   | true/false | false  |
|   wrapperStyle    |                                                                     设置遮罩层的内联样式                                                                      |     Object     |  否   |     -      |   -    |
|  dialogConStyle   |                                                                     设置弹窗主体内联样式                                                                      |     Object     |  否   |     -      |   无   |
| closeByTouchModal |                                                              是否可以通过点击 modal 关闭 TDialog                                                              |    Boolean     |  否   | true/false | false  |
|     showClose     |                                                                       是否显示关闭按钮                                                                        |    Boolean     |  否   | true/false |  true  |
|    customClass    |                                                                  为TDialog的主体部分添加类名                                                                  |     String     |  否   |     -      |   无   |
|    closeClass     |                                                                      为关闭按钮添加类名                                                                       |     String     |  否   |     -      |   无   |
|      animate      |                                                                       使用启用过渡动画                                                                        |    Boolean     |  否   | true/false |  true  |
|       modal       |                                                             是否需要遮罩层，只是将遮罩层设置透明                                                              |    Boolean     |  否   | true/false |  true  |
|   appendToBody    |                                                              TDialog 自身是否插入至 body 元素上                                                               |    Boolean     |  否   | true/false | false  |
|        top        |                                                             TDialog 主体部分距离遮罩层顶部的距离                                                              |     String     |  否   |     -      | "50%"  |
|   bounceOptions   | TDialog 主体部分距离动态升起，为false时不会动态升起，可传入一个配置对象表示动态升起：{ bounceState // true升起，false落下, distance: '' // 升起时移动的距离 } | Boolean/Object |  否   |     -      | false  |


## 事件

| 事件名 |                        含义                         | 事件参数 | 参数类型 |
| :----: | :-------------------------------------------------: | :------: | :------: |
| opened |            TDialog 打开动画结束时的回调             |    -     |    -     |
| close  | 为 TDialog 添加关闭事件，点击遮罩层或关闭按钮的事件 |    -     |    -     |
| closed |            TDialog 关闭动画结束时的回调             |    -     |    -     |

## 插槽

|  名称  | 含义                   |
| :----: | :--------------------- |
|   -    | TDialog 的内容         |
| header | TDialog 标题区的内容   |
| footer | TDialog 底部区域的内容 |


# TMessage

## 属性

|      属性名       |                  含义                   |  类型   | 必填  |        可选值         |  默认值  |
| :---------------: | :-------------------------------------: | :-----: | :---: | :-------------------: | :------: |
|      visible      |  是否显示 TMessage，支持 .sync 修饰符   | Boolean |  是   |      true/false       |  false   |
|       title       |  TMessage 的标题部分，在主题图标下展示  | String  |  否   |           -           | 修改成功 |
|       tips        |   TMessage 的提示部分，在标题下方展示   | String  |  否   |           -           |    -     |
|   wrapperStyle    |          设置遮罩层的内联样式           | Object  |  否   |           -           |    -     |
|    msgBoxStyle    |        设置消息主体部分内联样式         | Object  |  否   |           -           |    -     |
| closeByTouchModal |   是否可以通过点击 modal 关闭TMessage   | Boolean |  否   |      true/false       |   true   |
|       type        |                  主题                   | String  |  否   | success/warning/error | success  |
|    customClass    |      为TMessage的主体部分添加类名       | String  |  否   |           -           |    无    |
|     duration      | 显示时间, 毫秒。设为 0 则不会自动关闭明 | number  |  否   |           -           |   2000   |
|      animate      |            使用启用过渡动画             | Boolean |  否   |      true/false       |   true   |
|        top        |  TMessage 主体部分距离遮罩层顶部的距离  | String  |  否   |           -           |  "50%"   |


## 事件

| 事件名 |                         含义                         | 事件参数 | 参数类型 |
| :----: | :--------------------------------------------------: | :------: | :------: |
| opened |            TMessage 打开动画结束时的回调             |    -     |    -     |
| close  | 为 TMessage 添加关闭事件，点击遮罩层或关闭按钮的事件 |    -     |    -     |
| closed |            TMessage 关闭动画结束时的回调             |    -     |    -     |

## 组件中的函数式调用

```js
/**
 * para1 --> String/Object 第一个参数可以为一个字符串（用于属性中的title部分）或一个配置对象（除visible外的属性）
 * para2 --> Function 对应 closed
 * para3 --> Function 对应 opened
 * return Promise，then方法的第一个回调函数在close时被调用
 */
this.$tMessage(para1, para2, para3)
    .then(() => {
        // 这里将在close时被调用
    })
```
