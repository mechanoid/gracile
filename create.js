import path from 'path'
export default async (migrationName, options = { dir: './fsd' }) => {
  const dir = path.resolve(process.cwd(), options.dir)
  console.log(migrationName, dir)
}
