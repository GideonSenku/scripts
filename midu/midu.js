// 赞赏:邀请码`A1040276307`
// 链接`http://html34.qukantoutiao.net/qpr2/bBmQ.html?pid=5eb14518`
// 农妇山泉 -> 有点咸

const cookieName = '米读'
const readTimeurlKey = 'senku_readTimeurl_midu'
const readTimeheaderKey = 'senku_readTimeheader_midu'
const readTimebodyKey = 'senku_readTimebody_midu'

const signurlKey = 'senku_signurl_midu'
const signheaderKey = 'senku_signheader_midu'
const signbodyKey = 'senku_signbody_midu'
const senku = init()
// 阅读
const readTimeurlVal = senku.getdata(readTimeurlKey)
const readTimeheaderVal = senku.getdata(readTimeheaderKey)
const readTimebodyVal = senku.getdata(readTimebodyKey)
// 签到
const signurlVal = senku.getdata(signurlKey)
const signheaderVal = senku.getdata(signheaderKey)
const signbodyVal = senku.getdata(signbodyKey)
const signinfo = {}
let subTitle = ''
let detail = ''
    ; (sign = async () => {
        senku.log(`🔔 ${cookieName}`)
        await readTime()
        await sign()
        showmsg()
        senku.done()
    })().catch((e) => senku.log(`❌ ${cookieName} 签到失败: ${e}`), senku.done())




// 每日签到
function sign() {
    return new Promise((resolve, reject) => {
        const url = { url: signurlVal, headers: JSON.parse(signheaderVal), body: signbodyVal }
        senku.post(url, (error, response, data) => {
            try {
                senku.log(`❕ ${cookieName} sign - response: ${JSON.stringify(response)}`)
                signinfo.sign = JSON.parse(data)
                resolve()
            } catch (e) {
                senku.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
                senku.log(`❌ ${cookieName} sign - 签到失败: ${e}`)
                senku.log(`❌ ${cookieName} sign - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}

// 阅读时长
function readTime() {
    return new Promise((resolve, reject) => {
        const url = { url: readTimeurlVal, headers: JSON.parse(readTimeheaderVal), body: readTimebodyVal }
        senku.post(url, (error, response, data) => {
            try {
                senku.log(`❕ ${cookieName} readTime - response: ${JSON.stringify(response)}`)
                signinfo.readTime = JSON.parse(data)
                if (signinfo.readTime && signinfo.readTime.code == 0) {
                    const coin = signinfo.readTime.data.coin
                    const readTotalMinute = signinfo.readTime.data.readTotalMinute
                    coin == 0 ? detail += `` : detail += `【阅读时长】获得${coin}💰`
                    if (readTotalMinute % 40 == 0) {
                        detail += ` 阅读时长${readTotalMinute}分钟\n`
                        senku.msg(cookieName, subTitle, detail)
                    }
                } else if (signinfo.readTime.code != 0) {
                    detail += `【阅读时长】错误代码${signinfo.readTime.code},错误信息${signinfo.readTime.message}\n`
                    senku.msg(cookieName, subTitle, detail)
                } else {
                    detail += '【阅读时长】失败\n'
                    senku.msg(cookieName, subTitle, detail)
                }
                resolve()
            } catch (e) {
                senku.msg(cookieName, `阅读时长: 失败`, `说明: ${e}`)
                senku.log(`❌ ${cookieName} readTime - 签到失败: ${e}`)
                senku.log(`❌ ${cookieName} readTime - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}

function showmsg() {
    subTitle += ''
    detail += ''

    if (signinfo.sign && signinfo.sign.code == 0) {
        if (signinfo.sign.data) {
            const amount = signinfo.sign.data.amount
            const sign_video_amount = signinfo.sign.sign_video_amount
            const total = amount + sign_video_amount
            amount == 0 ? detail += `【签到奖励】获得${total}💰\n` : detail += `重复`
        }
    } else subTitle += '签到:失败'
    senku.msg(cookieName, subTitle, detail)
    senku.done()
}

function init() {
    isSurge = () => {
        return undefined === this.$httpClient ? false : true
    }
    isQuanX = () => {
        return undefined === this.$task ? false : true
    }
    getdata = (key) => {
        if (isSurge()) return $persistentStore.read(key)
        if (isQuanX()) return $prefs.valueForKey(key)
    }
    setdata = (key, val) => {
        if (isSurge()) return $persistentStore.write(key, val)
        if (isQuanX()) return $prefs.setValueForKey(key, val)
    }
    msg = (title, subtitle, body) => {
        if (isSurge()) $notification.post(title, subtitle, body)
        if (isQuanX()) $notify(title, subtitle, body)
    }
    log = (message) => console.log(message)
    get = (url, cb) => {
        if (isSurge()) {
            $httpClient.get(url, cb)
        }
        if (isQuanX()) {
            url.method = 'GET'
            $task.fetch(url).then((resp) => cb(null, resp, resp.body))
        }
    }
    post = (url, cb) => {
        if (isSurge()) {
            $httpClient.post(url, cb)
        }
        if (isQuanX()) {
            url.method = 'POST'
            $task.fetch(url).then((resp) => cb(null, resp, resp.body))
        }
    }
    done = (value = {}) => {
        $done(value)
    }
    return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
