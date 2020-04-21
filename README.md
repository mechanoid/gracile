![GitHub](https://img.shields.io/github/license/mechanoid/gracile)
![npm](https://img.shields.io/npm/v/gracile)
![Maturity](https://img.shields.io/badge/maturity-alpha-lightgrey)

gracile is a small footprint db migration tool.

## Installation / Usage

Install the package inside of your app

```
npm install gracile --save-dev # (as development dependency is usually feasible)

or

npm install -g gracile # (as global dependency)
```

run the provided binary for help

```
# if installed as part of a project you can access the binary via npx

npx gracile --help

# or without npx if you have installed it globally

gracile --help
```

`gracile` provides two basic commands:

- `create` - provides a simple scaffolding of a new migration file
- `migrate` - runs the migrations found in the migration directory

Call the individual usage instructions by

```
gracile create --help

# and

gracile migrate --help
```

`gracile migrate` can take some db config arguments which might be supported
by an operator. Please give a read to the operator Readme for more details.

`gracile` also features `dotenv`, which allows to put a `.env` file in your
app directory. This makes the variables listed in the .env file available
as ENV vars to the node process (readable by `process.env.ENV_VAR`).

This allows database adapters like e.g. postgres to read the connection parameters
directly from there without necessity to pass the connection parameters as CLI arguments.

## Plugins

the `migrate` action of gracile can make use of operator plugins
that provide the migrations to a database and maintain the status
of the migrations and if they have already been applied.

### Available Operators

- [PostgreSQL](https://github.com/mechanoid/gracile-postgres)

## Example

Lets start with a fresh new application

```bash
mkdir my-app
cd my-app
npm init
```

After initialization of the app we add gracile and the
related postgres operator to the app project.

```bash
npm install gracile gracile-postgres
```

Once the dependencies have been installed we can create our first migration:

```bash
npx gracile create CreateUserTable
```

This command provides us with a very thin shell for a new migration.
The filename is prefixed with a timestamp, that will serve as a migration Id
for maintaining our run book.

```bash
cat ./migrations/1587449246840-CreateUserTable.js
=>
export const migration = () => {}
```

The migrations do not give you much restrictions. The `gracile-postgres` operator
expects a query, query-String, or a list of queries/queryStrings where a query
also might be represented as an array in the format ["queryString $1,$2", [arg1, arg2]].

Other operators might differ from this pattern, as other databases might have different needs.

The only fixed interface for now is, that a migration provides a `migration` function export.

`gracile` does not provide `up`/`down` methods (for now) as this is rarely a
good idea. If you really desire rollbacks use a db that supports transactions.
The `gracile-postgres` operator tries to wrap all migrations in a transaction,
out of the box. Other operators might not provide the same.

Lets extend our migration example now with some real world code. We use `knex` and `pg`
as a query builder here, but you might also want to create your queries
either manually or in a completely different manner.

```bash
npm i knex pg # install the dependencies first
```

```javascript
import knex from 'knex'
const pg = knex({ client: 'pg' })

const createUserTable = pg.schema.createTable('users', function(table) {
  table.increments()
  table.string('name')
  table.timestamps()
})

export const migration = () =>
  [createUserTable].map(statement => statement.toString())
```

After adding the migration we can now run the migration script

```bash
npx gracile migrate -o gracile-postgres

=> (output might differ in future versions)

init
Apply: create table "users" ("id" serial primary key, "name" varchar(255), "created_at" timestamptz, "updated_at" timestamptz)
done!
```

After running our migrations you find 2 new tables in your database, the `user` table and the `gracilemigrations` table.
Each applied migration is listed there in case of the gracile-postgres adapter.
