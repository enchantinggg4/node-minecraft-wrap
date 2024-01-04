const fs = require("fs")
const crypto = require('mz/crypto')

const stuff = {
    id: 'fabric-loader-0.15.3-1.19.4',
    inheritsFrom: '1.19.4',
    time: '2024-01-03T16:41:30+03:00',
    releaseTime: '2024-01-03T16:41:30+03:00',
    type: 'release',
    mainClass: 'net.fabricmc.loader.impl.launch.knot.KnotClient',
    minimumLauncherVersion: 0,
    arguments: { jvm: [[Object]], game: [] },
    assets: 'legacy',
    libraries: [
        {
            name: 'org.ow2.asm:asm:9.6',
            url: 'https://maven.fabricmc.net/',
            sha1: 'aa205cf0a06dbd8e04ece91c0b37c3f5d567546a',
            size: 123598
        },
        {
            name: 'org.ow2.asm:asm-analysis:9.6',
            url: 'https://maven.fabricmc.net/',
            sha1: '9ce6c7b174bd997fc2552dff47964546bd7a5ec3',
            size: 34041
        },
        {
            name: 'org.ow2.asm:asm-commons:9.6',
            url: 'https://maven.fabricmc.net/',
            sha1: 'f1a9e5508eff490744144565c47326c8648be309',
            size: 72194
        },
        {
            name: 'org.ow2.asm:asm-tree:9.6',
            url: 'https://maven.fabricmc.net/',
            sha1: 'c0cdda9d211e965d2a4448aa3fd86110f2f8c2de',
            size: 51935
        },
        {
            name: 'org.ow2.asm:asm-util:9.6',
            url: 'https://maven.fabricmc.net/',
            sha1: 'f77caf84eb93786a749b2baa40865b9613e3eaee',
            size: 91131
        },
        {
            name: 'net.fabricmc:sponge-mixin:0.12.5+mixin.0.8.5',
            url: 'https://maven.fabricmc.net/',
            sha1: '8d31fb97c3e0cd7c8dad3441851c523bcfae6d8e',
            size: 1451874
        },
        {
            name: 'net.fabricmc:intermediary:1.19.4',
            url: 'https://maven.fabricmc.net/',
            sha1: 'e9852a6227fd3dae2484d2368d0c6092ca438481',
            size: 561002
        },
        {
            name: 'net.fabricmc:fabric-loader:0.15.3',
            url: 'https://maven.fabricmc.net/',
            sha1: '2ca88d3e40732dabca6dd01178ac04c3d675fecc',
            size: 1198587
        }
    ],
    logging: {
        client: {
            argument: '-Dlog4j.configurationFile=${path}',
            file: [Object],
            type: 'log4j2-xml'
        }
    }
}


async function iCanFixHer(raw) {
    const d = raw.libraries.map(async (a) => {
        if (!a.sha1) {
            const s = a.name.split(':')
            const path = [s[0].replaceAll('.', '/'), s[1], s[2], s[1] + '-' + s[2] + '.jar'].join('/')
            const res = await fetch(a.url + path)

            const buffer = Buffer.from(await res.arrayBuffer())


            return {
                ...a,
                sha1: crypto.createHash('sha1').update(buffer).digest('hex'),
                size: buffer.length
            }
        }
        return a
    })

    const results = await Promise.all(d)
    console.log({
        ...raw,
        libraries: results
    })
}



const remapFabric = (ver) => {
    return {
        ...ver,
        libraries: ver.libraries.map(it => {
            const s = it.name.split(':')
            const path = [s[0].replaceAll('.', '/'), s[1], s[2], s[1] + '-' + s[2] + '.jar'].join('/')


            return {
                name: it.name,
                downloads: {
                    artifact: {
                        path: path,
                        sha1: it.sha1,
                        size: it.size,
                        url: it.url + path
                    }

                },
                rules: it.rules,
            }
        })
    }

}


const WrapClient = require('./lib/wrap_client');


const version = '1.19.4'


const fabricVersion = remapFabric(stuff)





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

    await c.installFabric(fabricVersion)

    await c.start()

}

iCanFixHer(stuff).then(a)