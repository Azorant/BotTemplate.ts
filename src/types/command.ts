import type { CommandInteraction } from 'discord.js';
import type { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import { Main } from '../index.ts';

export abstract class Command {
  abstract definition: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;
  abstract execute(context: Main, interaction: CommandInteraction): Promise<void> | void;
}
