import { Client, ClientEvents, Collection } from 'discord.js';
import { GatewayIntentBits, Routes } from 'discord-api-types/v10';
import '@std/dotenv/load';
import * as datetime from '@std/datetime';
import { walkSync } from '@std/fs';
import { join, toFileUrl } from '@std/path';
import { Command } from './types/command.ts';
import { Event } from './types/event.ts';

enum LogLevel {
  Info,
  Warning,
  Error,
}

export class Main {
  client: Client;
  commands: Collection<string, Command> = new Collection();

  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds],
    });

    this.start();
  }

  private async start() {
    await this.loadCommands();
    await this.loadEvents();

    this.client.login();
  }

  private log(level: LogLevel, module: string, ...data: unknown[]) {
    console.log(
      `${datetime.format(new Date(), 'HH:mm:ss')} [${level === LogLevel.Info ? 'info' : level === LogLevel.Warning ? 'warn' : 'error'}] [${module}]`,
      ...data,
    );
  }

  info(module: string, ...data: unknown[]) {
    this.log(LogLevel.Info, module, ...data);
  }

  warn(module: string, ...data: unknown[]) {
    this.log(LogLevel.Warning, module, ...data);
  }

  error(module: string, ...data: unknown[]) {
    this.log(LogLevel.Error, module, ...data);
  }

  async loadCommands() {
    const files = walkSync(join(import.meta.dirname!, 'commands'), {
      includeDirs: false,
    });

    for (const file of files) {
      if (file.name.startsWith('_')) continue;
      const { default: module } = await import(toFileUrl(file.path).href);
      const command = new module() as Command;
      this.commands.set(command.definition.name, command);
      this.info('Client', `Command ${command.definition.name} loaded`);
    }
  }

  async loadEvents() {
    const files = walkSync(join(import.meta.dirname!, 'events'), {
      includeDirs: false,
    });

    this.client.removeAllListeners();

    for (const file of files) {
      if (file.name.startsWith('_')) continue;
      const { default: module } = await import(toFileUrl(file.path).href);
      const event = new module() as Event;
      if (event.once) {
        this.client.once(event.event as keyof ClientEvents, (...data) => event.execute(this, ...data));
      } else this.client.on(event.event as keyof ClientEvents, (...data) => event.execute(this, ...data));

      this.info('Client', `Event ${event.event} loaded ${event.once ? 'once' : ''}`);
    }
  }

  async deployCommands() {
    const commands = this.commands.map((command: Command) => command.definition.toJSON());
    const data = (await this.client.rest.put(Routes.applicationGuildCommands(this.client.user!.id, Deno.env.get('DEV_GUILD')!), {
      body: commands,
    })) as unknown[];

    this.info('Client', `Registered ${data.length} commands`);
  }
}

new Main();
