

# [readme-manager](https://code.eutychia.org/kay/readme-manager)
helps manage and harmonise READMEs in many repositories with template files available on [deno.land/x/readme_manager](https://deno.land/x/readme_manager)


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

## Example
You can check out the current templates I use for my project (including this very readme) [over here](https://code.eutychia.org/kay/readme-templates).

## Templating
When you bootstrap the templates forlder, 3 examples files will be create for you :
- README.template.md: this is the base file that gets used when rendering your readme. You can await stuff in it. **This is the only required file**
- HEADER.template.md: is an example header you might use
- FOOTER.template.md: is an example footer you might use

Feel free to adjust, remove or add any files you might want. Simply keep in mind that `README.template.md` is required and will be the base for rendering.

Any file in the templates folder will be automatically required and available by its filename with `include`.

Any file that starts with `.` will be ignored.

## Template variables
The following variables are available to the template (on `it`):
- name: basename of the folder the README is in
- readme: content of the readme template file
- readmeFilePath: the absolute filepath of the readme
- readmeDirectoryPath: the absolute path of the directory containing the readme
- gitTag: the current git tag
- gitURL: the repository url
- gitCommit: the sha of the current commit
- gitBranch: the current checkout out branch

You can use javascript inside the templates and also async templates for data fetching (see Eta docs)

Awaits are only supported at the top level `README.template.md`.

## Templating docs
The templating engine use is https://deno.land/x/eta@v1.12.3.

More information about it can be found on their documentation.

## Suggestion
If you are going to be using this for many repositories you might want tot setup a git template folder and add a precommit hook that runs the `readme-manager`.

Here is what mine looks like:
```bash
# ~/.git-templates/hooks/pre-commit
# git config --global init.templatedir '~/.git-templates'
# git init 

#!/usr/bin/env bash
~/.deno/bin/readme-manager
git add -u
```



## Development

To clone the repository locally:

```bash
$ git clone https://code.eutychia.org/kay/readme-manager.git
```

## Contributing

See [this page](https://code.eutychia.org/kay/contributing/-/blob/main/README.md) for more information on contributing to this project.

### Issues
Open new issues by mailing [eutychia.gitlab+kay-readme-manager-67-issue-@gmail.com](mailto:eutychia.gitlab+kay-readme-manager-67-issue-@gmail.com)

---
beep boop

