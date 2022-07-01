export const help = () => {
  console.log("Usage:");
  console.log("\t readme-manager \t\t Run the manager.");
  console.log("\t readme-manager --bootstrap \t Create templates.");
  console.log("\t readme-manager --debug \t Enables debugging mode.");
  console.log("\t readme-manager --help \t\t Shows this help page.");
  Deno.exit(0);
};
