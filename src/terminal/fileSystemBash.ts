export type FileBash = { name: string; data: string };
export type FolderBash = { name: string; children: (FolderBash | FileBash)[] };
// @ts-ignore
import aboutMD from "../text/about.md";

const disk: FolderBash = {
  name: "/",
  children: [
    { name: "bin", children: [] },
    { name: "dev", children: [] },
    {
      name: "home",
      children: [
        {
          name: "user",
          children: [
            { name: "Home", children: [{ name: "home.md", data: "text" }] },
            { name: "About", children: [{ name: "about.md", data: aboutMD }] },
            {
              name: "Projects",
              children: [
                { name: "writing-buddy.md", data: "text" },
                { name: "my-own-programming-language.md", data: "text" },
                { name: "glowbal.md", data: "text" },
                { name: "cyber-heist.md", data: "text" },
                { name: "pavilion.md", data: "text" },
              ],
            },
            {
              name: "Contact",
              children: [{ name: "contact.md", data: "text" }],
            },
          ],
        },
      ],
    },
    { name: "lib64", children: [] },
    { name: "media", children: [] },
    { name: "home", children: [] },
  ],
};

export default function FileSystemBash() {
  function getChildren(path: FolderBash[]) {
    return (path[path.length - 1] as any).children;
  }

  function goHome() {
    const home = disk.children.find((m) => m.name === "home") as FolderBash;
    const user = home.children.find((m) => m.name === "user") as FolderBash;
    return [disk, home, user];
  }

  function goto(path: (FolderBash | FileBash)[], newPath: string) {
    path = [...path];

    const newPathArray = newPath.split("/");
    // remove trailling slash
    if (newPathArray.length > 0 && newPathArray.at(-1) === "")
      newPathArray.pop();

    console.log("path", newPathArray);

    for (const p of newPathArray) {
      switch (p) {
        case "":
          // go to root
          path = [disk];
          break;
        case "..":
          // go up a folder
          if (path.length > 1) path.pop();
          break;
        case ".":
          // current folder
          break;
        default:
          // goto next location
          const currentFolder = path.at(-1);
          if (!currentFolder || !("children" in currentFolder))
            return undefined;

          const next = currentFolder.children.find((m) => m.name === p);
          if (!next) return undefined;

          path.push(next);
          break;
      }
    }
    return path;
  }

  return { getChildren, goHome, goto };
}
