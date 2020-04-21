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

const migrationId = filePath => {
  const fileName = path.basename(filePath, '.js')
  const [id] = fileName.split('-') // TODO: check for malformed filenames
  return id
}

export default async (options = { dir: './migrations' }) => {
  const dir = path.resolve(process.cwd(), options.dir)
  await fs.ensureDir(dir)

  const fileNames = await fs.readdir(dir)
  const filePaths = fileNames.map(n => path.join(dir, n))
  const migrations = await Promise.all(
    filePaths.map(f => import(f).then(m => ({ id: migrationId(f), module: m })))
  )

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

    for (const m of migrations) {
      await (transmit
        ? transmit(m.id, m.module.migration)
        : m.module.migration())
    }

    if (close) {
      await close()
    }
  } else {
    for (const m of migrations) {
      await m.module.migration()
    }
  }
}
