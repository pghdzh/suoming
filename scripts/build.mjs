/**
 * 构建入口：先把 TEMP / TMP 指向项目内的 .tmp，再调用 vite build。
 *
 * 为什么要多这一层：
 * esbuild 启动时会在系统临时目录里建一个 esbuild-<hash> 工作目录，
 * 收尾时再把它删掉。在 Windows 上这个"删"的动作经常被 ACL、杀毒软件
 * 扫描或残留句柄挡住，于是出现
 *   [vite:esbuild-transpile] remove C:\...\Temp\esbuild-xxxx: Access is denied
 * 此时模块其实已经全部转换完成（日志里能看到 ✓ 1588 modules transformed），
 * 失败只发生在最后的清理步骤。
 *
 * 把 TEMP 换到项目自身的 .tmp 之后，esbuild 的临时目录不再落在系统
 * AppData\Local\Temp 下，就不再受那边的权限/占用影响。
 *
 * .tmp 是纯临时目录，可以随时删除，构建时会自动重建。
 */
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const scratch = resolve(process.cwd(), ".tmp");
mkdirSync(scratch, { recursive: true });

process.env.TEMP = scratch;
process.env.TMP = scratch;

const { build } = await import("vite");
await build();
