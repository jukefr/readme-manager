# readme-manager
A command line application to handle templating your READMEs.

Define a template directory and write a README template for your
project then compile it into a proper README.

## Installation
```bash
$ deno install --name readme-manager --reload --allow-all https://deno.land/x/readme_manager/mod.ts
```

## Usage
On the first run without any arguments a setup will happen :
 - `match` corresponds to the name the README template will have inside the repository
it is created on first start but you can always recreate it with `--setup`
(default `.README.template.md`)
 - `templates` corresponds to the path where the rendering function is stored
it is boostrapped on first start but you can always access it with `--bootstrap`
(default `$USER_CONFIG_DIR/readme-manager`)

```bash
$ readme-manager
# Will guide you through setup on first run

$ readme-manager
# Will create readme in current directory with template and config

$ readme-manager my-project
# Will create readme in my-project directory with template and config

$ readme-manager [...] --templates [path]
# Will create a readme with config match and overriden template directory

$ readme-manager [...] --match [name]
# Will create a readme with config template directory and overriden match name

$ readme-manager [...] --templates [path] --match [name]
# Will create a readme and bypass configuration (if it exists)
```

There are also some other commands :
```bash
$ readme-manager --help
# Will print the help page

$ readme-manager --setup
# Re-run setup step and backup old config

$ readme-manager --bootstrap
# Re-run templates boostrapping step and backup old directory
```

There is also a debug flag available that can be added to any command :
```bash
$ readme-manager [...] --debug
# Will print more information to console and save all logs to the log file (instead of only errors by default)
```

## Template directory
The template directory is simply local a deno module.

Because of this, you might have to cache the deno packages used inside your template directory.
They are cached for you once automatically when you run the bootstrap process but if you add new imports you may need to do it manually.
```bash
$ deno cache $TEMPLATE_DIR/mod.ts
# Run this every time you add a new import to your module in the template directory.
```

## Suggestion
If you are going to be using this for many repositories you might want tot setup a git template folder and add a precommit hook that runs the `readme-manager`.

## Template engine
The templating engine used is https://deno.land/x/eta@v1.12.3.

More information about it can be found on their documentation.


---
made with love by k
