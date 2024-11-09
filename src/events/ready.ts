import { Events } from 'discord.js';
import { Event } from '../types/event.ts';
import { Main } from '../index.ts';

export default class ReadyEvent implements Event<Events.ClientReady> {
  event = Events.ClientReady;

  execute(context: Main) {
    context.info('Client', 'ready');
  }
}
