import globby from "globby";
import path from "path";
import { LoadContext, Plugin } from "@docusaurus/types";
import { PluginOptions } from "./types";

import {parseMarkdownMetadata} from './utils/markdownMetadataParser'
import {fileContent} from './utils/ioUtils'

const DEFAULT_OPTIONS: PluginOptions = {
  paths: ["docs"], // Path to docs on filesystem, relative to site dir.
};

export default function pluginFrontmatters(
  context: LoadContext,
  opts: Partial<PluginOptions>
): Plugin<object> {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  const getPaths = () => {
     const contentPaths = options.paths.map(eachPath => path.resolve(context.siteDir, eachPath));
  return contentPaths.map(path => `${path}/**/*.{md,mdx}`);
}

  return {
    name: "docusaurus-plugin-frontmatter",
    getPathsToWatch() {
     return getPaths()
    },
    
    async loadContent() {
      const pagesFiles = await globby(getPaths(), {
        cwd: context.siteDir
      });

      const content = pagesFiles.map(fileContent)

      return content.map(parseMarkdownMetadata)
    },
    
    async contentLoaded({content, actions}) {
      actions.setGlobalData(content)
    }
  };
}
