import path from 'path'
import fs from 'fs-extra'

const migrationFileName = migrationName => `${Date.now()}-${migrationName}.js`

const migrationTemplate = () => `
export const up = () => {}
`

export default async (migrationName, options = { dir: './fsd' }) => {
  const dir = path.resolve(process.cwd(), options.dir)
  const fileName = migrationFileName(migrationName)
  const filePath = path.resolve(dir, fileName)
  const relativePath = path.relative(process.cwd(), filePath)
  const exists = await fs.pathExists(filePath)

  await fs.ensureDir(dir)

  if (exists) {
    // should not ever happen, due to the timestamp, but who knows
    throw new Error('migration file already exists')
  }

  await fs.outputFile(filePath, migrationTemplate())
  return `${relativePath} has been successfully created`
}
