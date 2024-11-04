import type { Events, ClientEvents } from "discord.js";
import { Main } from "../index.ts";

export abstract class Event<T extends keyof ClientEvents = keyof ClientEvents> {
  abstract event: Events;
  abstract execute(context: Main, ...args: ClientEvents[T]): Promise<void> | void;
  abstract once?: boolean;
}
