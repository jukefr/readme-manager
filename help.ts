/**
 * Prints the available commands.
 */
export const help = [
  "readme-manager \t\t\t\t\t\t\t\t Run the manager in current directory.",
  "readme-manager [project_path] \t\t\t\t\t\t Run the manager in directory.",
  "readme-manager [project_path] --templates [path] \t\t\t Template path override.",
  "readme-manager [project_path] --match [name] \t\t\t\t Match name override.",
  "readme-manager [project_path] --templates [path] --match [name] \t Templates path and match name override.",
  "readme-manager --bootstrap \t\t\t\t\t\t Create templates.",
  "readme-manager --setup \t\t\t\t\t\t\t Create configuration.",
  "readme-manager --help \t\t\t\t\t\t\t Shows this help page.",
  "readme-manager [...] --debug \t\t\t\t\t\t Enables debugging mode on any command.",
];
