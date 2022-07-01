export const help = () => {
  console.log(
    "readme-manager \t\t\t\t\t\t\t\t Run the manager in current directory.",
  );
  console.log(
    "readme-manager [project_path] \t\t\t\t\t\t Run the manager in directory.",
  );
  console.log(
    "readme-manager [project_path] --templates [path] \t\t\t Template path override.",
  );
  console.log(
    "readme-manager [project_path] --match [name] \t\t\t\t Match name override.",
  );
  console.log(
    "readme-manager [project_path] --templates [path] --match [name] \t Templates path and match name override.",
  );

  console.log("readme-manager --bootstrap \t\t\t\t\t\t Create templates.");
  console.log("readme-manager --setup \t\t\t\t\t\t\t Create configuration.");
  console.log("readme-manager --help \t\t\t\t\t\t\t Shows this help page.");
  console.log(
    "readme-manager [...] --debug \t\t\t\t\t\t Enables debugging mode on any command.",
  );
  Deno.exit(0);
};
