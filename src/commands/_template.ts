import { CommandInteraction } from 'discord.js';
import type { Command } from '../types/command.ts';
import { Main } from '../index.ts';
import { SlashCommandBuilder } from '@discordjs/builders';

export default class TemplateCommand implements Command {
  definition = new SlashCommandBuilder()
    .setName('template')
    .setDescription('Template command');

  execute(context: Main, interaction: CommandInteraction) {
    interaction.reply('Hello');
  }
}
