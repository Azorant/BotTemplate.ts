import { Events } from "discord.js";
import { Event } from "../types/event.ts";
import { Main } from "../index.ts";

export default class DeployCommandsEvent implements Event<Events.ClientReady> {
  event = Events.ClientReady;
  once = true;
  execute(context: Main) {
    context.deployCommands();
  }
}
