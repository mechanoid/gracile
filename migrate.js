import { createRequire } from 'module'
import path from 'path'
import fs from 'fs-extra'
import filterKeys from 'object-filter-keys'

const localRequire = createRequire(process.cwd(), 'node_modules')

// hack because import() is not looking up node_modules in process.cwd()
// Maybe the behaviour is linked to the local dev setup. This will be evaluated
// once the handover to the plugin works as expected
const resolvePluginPath = pluginName => {
  const pluginPath = path.resolve(process.cwd(), 'node_modules', pluginName)
  const pluginPackagePath = path.resolve(pluginPath, 'package.json')
  const plugin = localRequire(pluginPackagePath)
  if (!(plugin && plugin.main)) {
    throw new Error(`the plugin "${pluginName}" provides no "main" property`)
  }
  return path.resolve(pluginPath, plugin.main)
}

export default async (options = { dir: './migrations' }) => {
  const dir = path.resolve(process.cwd(), options.dir)
  await fs.ensureDir(dir)

  const fileNames = await fs.readdir(dir)
  const filePaths = fileNames.map(n => path.join(dir, n))
  const migrations = await Promise.all(filePaths.map(f => import(f)))

  if (options.operator) {
    const operatorModulePath = resolvePluginPath(options.operator)
    const { init, transmit, close } = await import(operatorModulePath)

    if (init) {
      const operatorConfig = filterKeys(
        options,
        'host',
        'port',
        'username',
        'password'
      )
      await init(operatorConfig)
    }

    // this interface allows async .up messages, and allows variable behavior of operators
    const results = await Promise.all(
      migrations.map(m => (transmit ? transmit(m.up) : m.up()))
    )

    if (close) {
      await close()
    }

    return results
  } else {
    migrations.map(m => m.up())
  }
}
