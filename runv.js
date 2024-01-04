const fs = require("fs")


const WrapClient = require('./lib/wrap_client');


const version = '1.19.4'


async function a() {

    const java = `C:\\Users\\parad\\AppData\\Roaming\\.minecraft\\runtime\\java-runtime-gamma\\windows\\java-runtime-gamma\\bin\\java`
    const javaArgs = [
        '-XX:-UseAdaptiveSizePolicy',
    ]
    const c = new WrapClient('./.minecraft', version, 'windows', java, javaArgs)

    c.on('queue_state', e => {
        console.log(e)
    })

    c.on('line', function (line) {
        console.log(line)
    })

    await c.prepare()
    await c.start()

}

a()