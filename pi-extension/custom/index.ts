/**
 * Custom local extension — local customizations that are NOT part of upstream.
 *
 * Currently provides:
 *   - /qrspi command (Questions → Research → Structure → Plan → Implement)
 *
 * See PATCHES.md at the project root for patches applied to upstream files.
 */
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";
import {
  isMuxAvailable,
  renameCurrentTab,
  renameWorkspace,
} from "../subagents/cmux.ts";

export default function customExtension(pi: ExtensionAPI) {
  // /qrspi command — Questions → Research → Structure → Plan → Implement
  pi.registerCommand("qrspi", {
    description: "Start a QRSPI session: /qrspi <what to build>",
    handler: async (args, ctx) => {
      const task = (args ?? "").trim();
      if (!task) {
        ctx.ui.notify("Usage: /qrspi <what to build>", "warning");
        return;
      }

      // Rename workspace and tab to show this is a QRSPI session
      if (isMuxAvailable()) {
        try {
          const label = task.length > 40 ? task.slice(0, 40) + "..." : task;
          renameWorkspace(`🏗️ ${label}`);
          renameCurrentTab(`🏗️ QRSPI: ${label}`);
        } catch {
          // non-critical — do not block the flow
        }
      }

      // Load the QRSPI skill from this extension's directory
      const qrspiSkillPath = join(dirname(new URL(import.meta.url).pathname), "qrspi-skill.md");
      let content = readFileSync(qrspiSkillPath, "utf8");
      content = content.replace(/^---\n[\s\S]*?\n---\n*/, "");
      pi.sendUserMessage(
        `<skill name="qrspi" location="${qrspiSkillPath}">\n${content.trim()}\n</skill>\n\n${task}`,
      );
    },
  });
}
